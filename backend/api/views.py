from os import path
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from .models import Volunteer, Admin, User, Organization, Event, Participation
from .serializers import VolunteerSerializer, AdminSerializer, OrganizationSerializer, EventSerializer, ParticipationSerializer
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework import status
from uuid import UUID, uuid4
from django.utils import timezone
from datetime import  date
from api.utils.permisions import IsVolunteer, IsAdmin, IsEmailVerified
from django.core.mail import send_mail
from django.conf import settings
from api.utils.email_token import email_verification_token
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_decode
from django.contrib.auth import get_user_model

User = get_user_model()



# 🔐 --- Authentication Views (JWT) ---

class CustomTokenObtainPairView(TokenObtainPairView):
    """Custom login view that sets access and refresh tokens as HttpOnly cookies."""
    def post(self, request, *args, **kwargs):
        try:
            # Authenticate and obtain JWT tokens
            response = super().post(request, *args, **kwargs)
            tokens = response.data

            access_token = tokens.get('access')
            refresh_token = tokens.get('refresh')
            email = request.data.get('email')

            if not email:
                return Response({'error': 'Email field is required.'}, status=400)

            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                return Response({'error': 'User not found'}, status=404)

            # Return user info + set secure cookies
            res = Response({
                'success': True,
                'message': 'Login successful',
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'username': user.username,
                    'role': user.role,
                }
            }, status=status.HTTP_200_OK)

            # Set tokens in cookies
            res.set_cookie(
                key='access_token',
                value=access_token,
                httponly=True,
                secure=True,
                samesite='None',
                path='/',
            )
            res.set_cookie(
                key='refresh_token',
                value=refresh_token,
                httponly=True,
                secure=True,
                samesite='None',
                path='/',
            )

            return res

        except Exception as e:
            return Response({'success': False, 'error': str(e)}, status=400)


class CustomTokenRefreshView(TokenRefreshView):
    """Refresh JWT tokens using HttpOnly refresh cookie."""
    def post(self, request, *args, **kwargs):
        try:
            refresh_token = request.COOKIES.get('refresh_token')
            if not refresh_token:
                return Response({'success': False, 'error': 'No refresh token found'}, status=400)

            request.data['refresh'] = refresh_token
            response = super().post(request, *args, **kwargs)
            tokens = response.data
            access_token = tokens.get('access')

            res = Response({'success': True}, status=200)
            res.set_cookie(
                key='access_token',
                value=access_token,
                httponly=True,
                secure=True,
                samesite='None',
                path='/',
            )
            return res
        except Exception as e:
            return Response({'success': False, 'error': str(e)}, status=400)


# 👤 --- User Profile Views ---

@api_view(['GET'])
@permission_classes([IsAuthenticated, IsVolunteer])
def get_my_volunteer_data(request):
    """Retrieve the logged-in volunteer's profile data."""
    try:
        volunteer = Volunteer.objects.get(user=request.user)
        serializer = VolunteerSerializer(volunteer)
        return Response(serializer.data)
    except Volunteer.DoesNotExist:
        return Response({'error': 'Volunteer profile not found'}, status=404)


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdmin])
def get_my_admin_data(request):
    """Retrieve the logged-in admin's profile data."""
    try:
        admin = Admin.objects.get(user=request.user)
        serializer = AdminSerializer(admin)
        return Response(serializer.data)
    except Admin.DoesNotExist:
        return Response({'error': 'Admin profile not found'}, status=404)
    

@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    """
    Register a new user (volunteer or admin).
    Admins can:
    - join existing organization (with join_code)
    - or create new one (with organization_name)
    """
    data = request.data
    role = data.get("role")

    # --- Common validation ---
    required_fields = ["email", "password", "confirm_password", "role"]
    for field in required_fields:
        if field not in data:
            return Response({"error": f"{field} is required."}, status=400)

    if data["password"] != data["confirm_password"]:
        return Response({"error": "Passwords do not match."}, status=400)

    if User.objects.filter(email=data["email"]).exists():
        return Response({"error": "User with this email already exists."}, status=400)

    # --- Create User ---
    user = User.objects.create_user(
        email=data["email"],
        username=data.get("username", data["email"]),
        password=data["password"],
        role=role
    )
    user.is_active = False  # Inactive until email verification
    user.save()

    # ---------------- VOLUNTEER ----------------
    if role == "volunteer":
        date_of_birth = data.get("date_of_birth")
        if not date_of_birth:
            user.delete()
            return Response({"error": "date_of_birth is required for volunteers."}, status=400)

        volunteer = Volunteer.objects.create(
            user=user,
            date_of_birth=date_of_birth,
            school_or_organization=data.get("school_or_organization", "")
        )

        send_verification_email(request, user)

        return Response({
            "message": "Volunteer registered successfully.",
            "volunteer": {
                "id": str(volunteer.id),
                "email": user.email,
                "date_of_birth": date_of_birth
            }
        }, status=201)

    # ---------------- ADMIN ----------------
    elif role == "admin":
        join_code = data.get("join_code")
        org_name = data.get("organization_name")

        if join_code:
            # ✅ Join existing org
            try:
                organization = Organization.objects.get(join_code=join_code)
            except Organization.DoesNotExist:
                user.delete()
                return Response({"error": "Invalid join code."}, status=404)

        elif org_name:
            # ✅ Create new org safely with defaults
            organization = Organization.objects.create(
                name=org_name,
                date_of_establishment=data.get("date_of_establishment", date.today()),
                registration_number=data.get("registration_number", str(uuid4())[:10]),
                organization_type=data.get("organization_type", "Non-profit"),
                website=data.get("website", ""),
                description=data.get("description", ""),
                address=data.get("address", f"Address of {org_name}"),
                city=data.get("city", "Unknown"),
                country=data.get("country", "Unknown"),
            )

        else:
            user.delete()
            return Response({
                "error": "Provide either 'join_code' to join or 'organization_name' to create a new one."
            }, status=400)

        # ✅ Create admin profile
        admin = Admin.objects.create(
            user=user,
            organization=organization,
            phone_number=data.get("phone_number", ""),
            job_title=data.get("job_title", "")
        )

        send_verification_email(request, user)

        return Response({
            "message": "Admin registered successfully.",
            "organization": {
                "id": str(organization.id),
                "name": organization.name,
                "join_code": organization.join_code
            },
            "admin": {
                "id": str(admin.id),
                "email": user.email
            }
        }, status=201)
        

    # ---------------- INVALID ROLE ----------------

    else:
        user.delete()
        return Response({"error": "Invalid role. Use 'volunteer' or 'admin'."}, status=400)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def authenticated(request):
    """Check if the user is authenticated."""
    return Response('authenticated')


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_user(request):
    """Logout the user by deleting JWT cookies."""
    try:
        res = Response()
        res.data = {'success': True, 'message': 'Logged out successfully'}
        res.delete_cookie('access_token', path='/')
        res.delete_cookie('refresh_token', path='/')
        return res
    except:
        return Response({'success': False, 'message': 'Logout failed'})


# 🏢 --- Organization Join/Quit Views ---

@api_view(['POST'])
@permission_classes([IsAuthenticated, IsVolunteer, IsEmailVerified])
def join_organization_by_code(request):
    """Volunteer joins an organization using a join code."""
    join_code = request.data.get('join_code')

    if not join_code:
        return Response({'success': False, 'message': 'Join code is required'}, status=400)

    try:
        volunteer = Volunteer.objects.get(user=request.user)
        organization = Organization.objects.get(join_code=join_code)

        if organization in volunteer.organizations.all():
            return Response({'success': False, 'message': 'Already a member of this organization'}, status=400)

        volunteer.organizations.add(organization)
        volunteer.save()

        orgs = volunteer.organizations.values('id', 'name')
        return Response({
            'success': True,
            'message': f'Joined {organization.name} successfully',
            'joined_organizations': list(orgs)
        })

    except Organization.DoesNotExist:
        return Response({'success': False, 'message': 'Invalid join code'}, status=404)
    

@api_view(['POST'])
@permission_classes([IsAuthenticated, IsVolunteer, IsEmailVerified])
def quit_organization_by_code(request):
    """Volunteer leaves an organization using a join code."""
    join_code = request.data.get('join_code')

    if not join_code:
        return Response({'success': False, 'message': 'Join code is required'}, status=400)

    try:
        volunteer = Volunteer.objects.get(user=request.user)
        organization = Organization.objects.get(join_code=join_code)

        if organization not in volunteer.organizations.all():
            return Response({'success': False, 'message': 'You are not a member of this organization'}, status=400)

        volunteer.organizations.remove(organization)
        volunteer.save()

        orgs = volunteer.organizations.values('id', 'name')
        return Response({
            'success': True,
            'message': f'You have quit {organization.name}',
            'remaining_organizations': list(orgs)
        })

    except Organization.DoesNotExist:
        return Response({'success': False, 'message': 'Invalid join code'}, status=404)


# 🆔 --- Admin/Volunteer Data Access by UUID ---

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_volunteer_data_by_id(request, volunteer_id):
    """Fetch a volunteer profile by UUID."""
    try:
        volunteer = Volunteer.objects.get(id=UUID(volunteer_id))
        serializer = VolunteerSerializer(volunteer)
        return Response(serializer.data)
    except Volunteer.DoesNotExist:
        return Response({'error': 'Volunteer not found'}, status=404)
    

@api_view(['PATCH'])
@permission_classes([IsAuthenticated, IsVolunteer])
def update_my_volunteer_data(request):
    """Allow volunteer to update their own profile."""
    try:
        volunteer = Volunteer.objects.get(user=request.user)
        serializer = VolunteerSerializer(volunteer, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
    except Volunteer.DoesNotExist:
        return Response({'error': 'Volunteer profile not found'}, status=404)
    

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_admin_data_by_id(request, admin_id):
    """Fetch an admin profile by UUID."""
    try:
        admin = Admin.objects.get(id=UUID(admin_id))
        serializer = AdminSerializer(admin)
        return Response(serializer.data)
    except Admin.DoesNotExist:
        return Response({'error': 'Admin not found'}, status=404)
    

@api_view(['PATCH'])
@permission_classes([IsAuthenticated, IsAdmin])
def update_my_admin_data(request):
    """Allow admin to update their own profile."""
    try:
        admin = Admin.objects.get(user=request.user)
        serializer = AdminSerializer(admin, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
    except Admin.DoesNotExist:
        return Response({'error': 'Admin profile not found'}, status=404)


# 🏛️ --- Organization Management ---

@api_view(['POST'])
@permission_classes([AllowAny])
def register_organization(request):
    """Create a new organization record."""
    serializer = OrganizationSerializer(data=request.data)
    if serializer.is_valid():
        organization = serializer.save()
        return Response(OrganizationSerializer(organization).data, status=201)
    return Response(serializer.errors, status=400)


# 📅 --- Event Management ---

@api_view(['GET'])
@permission_classes([IsAuthenticated, IsVolunteer])
def get_my_events_as_volunteer(request):
    """Get all events from organizations the volunteer belongs to."""
    try:
        volunteer = Volunteer.objects.get(user=request.user)
        events = Event.objects.filter(organization__in=volunteer.organizations.all())
        serializer = EventSerializer(events, many=True)
        return Response({'events': serializer.data}, status=200)
    except Volunteer.DoesNotExist:
        return Response({'error': 'Volunteer profile not found'}, status=404)


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdmin])
def get_my_events_as_admin(request):
    """Get all events belonging to the admin's organization."""
    try:
        admin = Admin.objects.get(user=request.user)
        organization = admin.organization
        events = organization.events.all()
        serializer = EventSerializer(events, many=True)
        return Response({'events': serializer.data}, status=200)
    except Admin.DoesNotExist:
        return Response({'error': 'Admin profile not found'}, status=404)
    

@api_view(['POST'])
@permission_classes([IsAuthenticated, IsAdmin, IsEmailVerified])
def create_event(request):
    """Create a new event under the admin's organization."""
    try:
        admin = Admin.objects.get(user=request.user)
        organization = admin.organization

        serializer = EventSerializer(data=request.data)
        if serializer.is_valid():
            event = serializer.save(organization=organization)
            return Response({
                'success': True,
                'message': f'Event "{event.name}" created successfully',
                'event': EventSerializer(event).data
            }, status=201)
        return Response({'success': False, 'errors': serializer.errors}, status=400)
    except Admin.DoesNotExist:
        return Response({'error': 'Admin profile not found'}, status=404)
    

@api_view(['PATCH'])
@permission_classes([IsAuthenticated, IsAdmin, IsEmailVerified])
def update_event(request, event_id):
    """Update an event by its UUID."""
    try:
        admin = Admin.objects.get(user=request.user)
        organization = admin.organization
        event = organization.events.filter(id=event_id).first()
        if not event:
            return Response({'error': 'Event not found'}, status=404)
        serializer = EventSerializer(event, data=request.data, partial=True)
        if serializer.is_valid():
            updated_event = serializer.save()
            return Response({
                'success': True,
                'message': f'Event "{updated_event.name}" updated successfully',
                'event': EventSerializer(updated_event).data
            })
        return Response({'success': False, 'errors': serializer.errors}, status=400)
    except Admin.DoesNotExist:
        return Response({'error': 'Admin profile not found'}, status=404)
    

@api_view(['DELETE'])
@permission_classes([IsAuthenticated, IsAdmin, IsEmailVerified])
def delete_event(request, event_id):
    """Delete an event by its UUID."""
    try:
        admin = Admin.objects.get(user=request.user)
        organization = admin.organization
        event = organization.events.filter(id=event_id).first()
        if not event:
            return Response({'error': 'Event not found'}, status=404)
        event_name = event.name
        event.delete()
        return Response({
            'success': True,
            'message': f'Event "{event_name}" deleted successfully'
        }, status=200)
    except Admin.DoesNotExist:
        return Response({'error': 'Admin profile not found'}, status=404)


# 🙋 --- Participation Management ---

@api_view(['POST'])
@permission_classes([IsAuthenticated, IsVolunteer, IsEmailVerified])
def join_event(request, event_id):
    """Volunteer joins an event."""
    try:
        volunteer = Volunteer.objects.get(user=request.user)
        event = Event.objects.get(id=event_id)

        # Prevent joining twice
        if Participation.objects.filter(volunteer=volunteer, event=event).exists():
            return Response({'error': 'You already joined this event.'}, status=400)

        participation = Participation.objects.create(volunteer=volunteer, event=event)
        return Response({
            'message': f'Joined event "{event.name}" successfully.',
            'participation': ParticipationSerializer(participation).data
        }, status=201)
    except Volunteer.DoesNotExist:
        return Response({'error': 'Volunteer profile not found.'}, status=404)
    except Event.DoesNotExist:
        return Response({'error': 'Event not found.'}, status=404)
    

@api_view(['DELETE'])
@permission_classes([IsAuthenticated, IsVolunteer, IsEmailVerified])
def cancel_participation(request, event_id):
    """Volunteer cancels their participation in an event."""
    try:
        volunteer = Volunteer.objects.get(user=request.user)
        participation = Participation.objects.filter(volunteer=volunteer, event_id=event_id).first()

        if not participation:
            return Response({'error': 'You are not participating in this event.'}, status=404)

        participation.status = 'cancelled'
        participation.save()
        return Response({'message': f'Participation in "{participation.event.name}" cancelled.'}, status=200)
    except Volunteer.DoesNotExist:
        return Response({'error': 'Volunteer profile not found.'}, status=404)
    


@api_view(['PATCH'])
@permission_classes([IsAuthenticated, IsAdmin, IsEmailVerified])
def mark_participation_completed(request, participation_id):
    """Admin marks a volunteer's participation as completed."""
    try:
        admin = Admin.objects.get(user=request.user)
        participation = Participation.objects.get(id=participation_id)

        # Security check — admin must belong to same organization
        if participation.event.organization != admin.organization:
            return Response({'error': 'You cannot modify events from another organization.'}, status=403)

        participation.status = 'completed'
        participation.hours_completed = request.data.get('hours_completed', participation.event.service_hours)
        participation.date_completed = timezone.now()
        participation.save()

        return Response({
            'message': f'{participation.volunteer.user.username} marked as completed for "{participation.event.name}".',
            'participation': ParticipationSerializer(participation).data
        })
    except Admin.DoesNotExist:
        return Response({'error': 'Admin profile not found.'}, status=404)
    except Participation.DoesNotExist:
        return Response({'error': 'Participation record not found.'}, status=404)
    


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsVolunteer])
def get_my_participations_as_volunteer(request):
    """Get all participation records for the logged-in volunteer."""
    try:
        volunteer = Volunteer.objects.get(user=request.user)
        participations = volunteer.participations.select_related('event').all()
        serializer = ParticipationSerializer(participations, many=True)
        return Response({'participations': serializer.data}, status=200)
    except Volunteer.DoesNotExist:
        return Response({'error': 'Volunteer profile not found.'}, status=404)



@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdmin])
def get_participations_as_admin(request, event_id):
    """Get all participation records for events under the admin's organization."""
    try:
        admin = Admin.objects.get(user=request.user)
        organization = admin.organization
        participations = Participation.objects.filter(event__organization=organization, event_id=event_id).select_related('volunteer', 'event')
        serializer = ParticipationSerializer(participations, many=True)
        return Response({'participations': serializer.data}, status=200)
    except Admin.DoesNotExist:
        return Response({'error': 'Admin profile not found.'}, status=404)
    


def send_verification_email(request, user):
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    token = email_verification_token.make_token(user)
    verify_url = f"{request.scheme}://{request.get_host()}/api/verify-email/{uid}/{token}/"

    send_mail(
        subject="Verify your email - QuanTrack",
        message=f"Hi {user.username},\nPlease verify your email by clicking this link:\n{verify_url}",
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user.email],
        fail_silently=False,
    )



@api_view(['GET'])
@permission_classes([AllowAny])
def verify_email(request, uidb64, token):
    try:
        uid = urlsafe_base64_decode(uidb64).decode()
        user = User.objects.get(pk=uid)
    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        return Response({'error': 'Invalid verification link'}, status=400)

    if user.is_active:
        return Response({'message': 'Email already verified'}, status=200)

    if email_verification_token.check_token(user, token):
        user.is_active = True
        user.save()
        return Response({'message': 'Email successfully verified!'}, status=200)
    else:
        return Response({'error': 'Invalid or expired token'}, status=400)



@api_view(['POST'])
@permission_classes([IsAuthenticated])
def resend_verification_email(request):
    if request.user.is_active:
        return Response({'message': 'Email already verified'}, status=200)
    send_verification_email(request, request.user)
    return Response({'message': 'Verification email resent.'}, status=200)
