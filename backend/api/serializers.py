from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Participation, Volunteer, Admin, Organization, Event, Membership
from datetime import date
from django.utils.http import urlsafe_base64_decode
from django.utils.encoding import force_str
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.core.mail import send_mail
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes

User = get_user_model()


# ========== Base User Serializer ==========
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'role', 'is_active']
        read_only_fields = ['id']


# ========== Registration Serializer ==========
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)
    
    # Extra fields for volunteers/admins
    organization_name = serializers.CharField(write_only=True, required=False)
    city = serializers.CharField(write_only=True, required=False)
    country = serializers.CharField(write_only=True, required=False)
    date_of_birth = serializers.DateField(write_only=True, required=False)
    school_or_organization = serializers.CharField(write_only=True, required=False)
    
    profile_id = serializers.ReadOnlyField(source='get_profile_id')

    class Meta:
        model = User
        fields = [
            'id', 'email', 'username', 'password', 'confirm_password', 'role',
            'profile_id', 'organization_name', 'city', 'country',
            'date_of_birth', 'school_or_organization'
        ]

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError("Passwords do not match.")
        
        if data['role'] == 'admin' and not data.get('organization_name'):
            raise serializers.ValidationError("Organization name is required for admin registration.")
        
        return data

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with that email already exists.")
        return value

    def create(self, validated_data):
        # Pop extra fields
        organization_name = validated_data.pop('organization_name', None)
        city = validated_data.pop('city', None)
        country = validated_data.pop('country', None)
        date_of_birth = validated_data.pop('date_of_birth', None)
        school_or_organization = validated_data.pop('school_or_organization', None)
        validated_data.pop('confirm_password', None)

        # Create user
        user = User.objects.create_user(
            email=validated_data['email'],
            username=validated_data.get('username', validated_data['email']),
            password=validated_data['password'],
            role=validated_data['role']
        )
        user.is_active = False
        user.save()

        # Volunteer flow
        if user.role == 'volunteer':
            volunteer = Volunteer.objects.create(
                user=user,
                date_of_birth=date_of_birth,
                school_or_organization=school_or_organization or ""
            )
            user._profile_obj = volunteer

        # Admin flow: always create new org
        elif user.role == 'admin':
            organization = Organization.objects.create(
                name=organization_name,
                date_of_establishment=date.today(),
                organization_type="Non-profit",
                address=f"Address of {organization_name}",
                city=city or "Unknown",
                country=country or "Unknown",
                admin=user
            )
            admin = Admin.objects.create(user=user, organization=organization)
            user._profile_obj = admin

        return user

    def get_profile_id(self, obj):
        """Return profile ID dynamically"""
        if hasattr(obj, '_profile_obj'):
            return obj._profile_obj.id
        try:
            if obj.role == 'volunteer':
                return obj.volunteer.id
            elif obj.role == 'admin':
                return obj.admin.id
        except:
            return None
        


class VolunteerSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    profile_id = serializers.ReadOnlyField(source='id')  
    memberships = serializers.SerializerMethodField()
    date_of_birth = serializers.DateField()

    class Meta:
        model = Volunteer
        fields = [
            'profile_id', 'user', 'date_of_birth',
            'school_or_organization', 'memberships'
        ]

    def get_memberships(self, obj):
        memberships = Membership.objects.filter(volunteer=obj).select_related('organization')
        return [
            {
                'organization_id': str(m.organization.id),
                'organization_name': m.organization.name,
                'role': m.role,
                'status': m.status,
                'join_date': m.join_date
            }
            for m in memberships
        ]
    
    def validate_date_of_birth(self, value):
        from datetime import date
        today = date.today()
        min_age = 13
        if value > today:
            raise serializers.ValidationError("Date of birth cannot be in the future.")
        age = today.year - value.year - ((today.month, today.day) < (value.month, value.day))
        if age < min_age:
            raise serializers.ValidationError(f"Volunteer must be at least {min_age} years old.")
        return value
    

class AdminSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    profile_id = serializers.ReadOnlyField(source='id')  
    organization = serializers.PrimaryKeyRelatedField(queryset=Organization.objects.filter(admin__isnull=True))

    class Meta:
        model = Admin
        fields = ['profile_id', 'user', 'organization', 'job_title', 'phone_number']


class OrganizationSerializer(serializers.ModelSerializer):
    id = serializers.UUIDField(read_only=True)
    join_code = serializers.ReadOnlyField()
    admin = serializers.SerializerMethodField()

    class Meta:
        model = Organization
        fields = [
            'id',
            'name',
            'date_of_establishment',
            'registration_number',
            'organization_type',
            'website',
            'description',
            'logo',
            'address',
            'city',
            'country',
            'join_code',
            'admin',
        ]

    def get_admin(self, obj):
        admin = getattr(obj, 'admin', None)
        if admin:
            return {
                "id": str(admin.id),
                "username": admin.user.username,
                "email": admin.user.email,
            }
        return None

    def validate_date_of_establishment(self, value):
        from datetime import date
        if value > date.today():
            raise serializers.ValidationError("Date of establishment cannot be in the future.")
        return value



class JoinOrganizationSerializer(serializers.Serializer):
    join_code = serializers.CharField(max_length=10)

    def validate_join_code(self, value):
        try:
            organization = Organization.objects.get(join_code=value)
        except Organization.DoesNotExist:
            raise serializers.ValidationError("Invalid join code.")
        self.organization = organization
        return value

    def save(self, volunteer):
        membership, created = Membership.objects.get_or_create(
            volunteer=volunteer,
            organization=self.organization,
            defaults={'status': 'pending'}
        )
        if not created:
            raise serializers.ValidationError("You have already joined or have a pending request.")
        return membership
    


class OrganizationMemberListSerializer(serializers.ModelSerializer):
    volunteer_name = serializers.CharField(source='volunteer.user.username', read_only=True)
    email = serializers.CharField(source='volunteer.user.email', read_only=True)

    class Meta:
        model = Membership
        fields = ['volunteer_name', 'email', 'role', 'status', 'join_date']
    

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ['id', 'name', 'description', 'date', 'time', 'location', 'is_public', 'service_hours']



class ParticipationSerializer(serializers.ModelSerializer):
    volunteer_name = serializers.CharField(source='volunteer.user.username', read_only=True)
    event_name = serializers.CharField(source='event.name', read_only=True)

    class Meta:
        model = Participation
        fields = [
            'id', 'volunteer', 'volunteer_name', 'event', 'event_name',
            'date_participated', 'hours_completed', 'status'
        ]
        read_only_fields = ['date_participated']


class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        if not User.objects.filter(email=value).exists():
            raise serializers.ValidationError("User with this email does not exist.")
        return value

    def save(self, request):
        user = User.objects.get(email=self.validated_data['email'])
        token_generator = PasswordResetTokenGenerator()
        token = token_generator.make_token(user)
        uidb64 = urlsafe_base64_encode(force_bytes(user.pk))

        reset_link = f"{request.scheme}://{request.get_host()}/api/password-reset-confirm/{uidb64}/{token}/"

        send_mail(
            subject="Password Reset Request",
            message=f"Click the link below to reset your password:\n{reset_link}",
            from_email="no-reply@quantrack.com",
            recipient_list=[user.email],
        )

        return {"message": "Password reset link sent to your email."}


class PasswordResetConfirmSerializer(serializers.Serializer):
    uidb64 = serializers.CharField()
    token = serializers.CharField()
    new_password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    def validate(self, data):
        if data['new_password'] != data['confirm_password']:
            raise serializers.ValidationError("Passwords do not match.")
        return data

    def save(self):
        try:
            uid = force_str(urlsafe_base64_decode(self.validated_data['uidb64']))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            raise serializers.ValidationError("Invalid user ID.")

        token_generator = PasswordResetTokenGenerator()
        if not token_generator.check_token(user, self.validated_data['token']):
            raise serializers.ValidationError("Invalid or expired token.")

        user.set_password(self.validated_data['new_password'])
        user.save()
        return {"message": "Password has been reset successfully."}



class VolunteerCertificateSerializer(serializers.Serializer):
    volunteer_id = serializers.UUIDField()
    start_date = serializers.DateField(required=False)
    end_date = serializers.DateField(required=False)