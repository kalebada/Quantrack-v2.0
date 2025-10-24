from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Participation, Volunteer, Admin, Organization, Event
from datetime import date

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
    organization_id = serializers.IntegerField(write_only=True, required=False)
    organization_name = serializers.CharField(write_only=True, required=False)
    city = serializers.CharField(write_only=True, required=False)
    country = serializers.CharField(write_only=True, required=False)
    date_of_birth = serializers.DateField(write_only=True, required=False)
    school_or_organization = serializers.CharField(write_only=True, required=False)
    
    profile_id = serializers.ReadOnlyField(source='get_profile_id')  # Will compute dynamically

    class Meta:
        model = User
        fields = [
            'id', 'email', 'username', 'password', 'confirm_password', 'role',
            'profile_id', 'organization_id', 'organization_name', 'city', 'country',
            'date_of_birth', 'school_or_organization'
        ]
    
    def validate(self, data):
        # Password match check
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError("Passwords do not match.")
        
        # Admin must have organization_id or organization_name
        if data['role'] == 'admin' and not (data.get('organization_id') or data.get('organization_name')):
            raise serializers.ValidationError("Organization ID or organization name is required for admin registration.")
        
        return data

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with that email already exists.")
        return value

    def create(self, validated_data):
        # Pop extra fields
        organization_id = validated_data.pop('organization_id', None)
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
        user.is_active = False  # Email verification required
        user.save()

        # Volunteer profile
        if user.role == 'volunteer':
            volunteer = Volunteer.objects.create(
                user=user,
                date_of_birth=date_of_birth,
                school_or_organization=school_or_organization or ""
            )
            user._profile_obj = volunteer  # Temporary for serializer field

        # Admin profile
        elif user.role == 'admin':
            if organization_id:
                try:
                    organization = Organization.objects.get(id=organization_id)
                except Organization.DoesNotExist:
                    user.delete()
                    raise serializers.ValidationError("Organization not found.")
            else:  # create new organization
                organization = Organization.objects.create(
                    name=organization_name,
                    date_of_establishment=date.today(),
                    organization_type="Non-profit",
                    address=f"Address of {organization_name}",
                    city=city or "Unknown",
                    country=country or "Unknown"
                )
            admin = Admin.objects.create(user=user, organization=organization)
            user._profile_obj = admin  # Temporary for serializer field

        return user

    def get_profile_id(self, obj):
        """Dynamically return profile ID (volunteer/admin)"""
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
    organizations_names = serializers.SerializerMethodField()
    date_of_birth = serializers.DateField()

    class Meta:
        model = Volunteer
        fields = ['profile_id', 'user', 'date_of_birth', 'school_or_organization', 'organizations', 'organizations_names']

    def get_organizations_names(self, obj):
        return [org.name for org in obj.organizations.all()]
    
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
    organization = serializers.PrimaryKeyRelatedField(queryset=Organization.objects.all())

    class Meta:
        model = Admin
        fields = ['profile_id', 'user', 'organization', 'job_title', 'phone_number']


class OrganizationSerializer(serializers.ModelSerializer):
    join_code = serializers.ReadOnlyField()
    admins = serializers.SerializerMethodField()  

    class Meta:
        model = Organization
        fields = ['id', 'name', 'date_of_establishment', 'registration_number', 'organization_type',
                  'website', 'description', 'logo', 'address', 'city', 'country', 'join_code', 'admins']
        

    def get_admins(self, obj):
        admins = obj.admins.all()
        return [
            {"id": admin.id, "username": admin.user.username, "email": admin.user.email}
            for admin in admins
        ]
    
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
        return value
    

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