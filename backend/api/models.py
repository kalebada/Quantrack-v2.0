from django.db import models
from django.utils import timezone
from django.contrib.auth.models import AbstractUser
import uuid

def generate_join_code():
    return uuid.uuid4().hex[:10].upper()

class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    ROLE_CHOICES = [
        ('volunteer', 'Volunteer'),
        ('admin', 'Admin'),
    ]
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    email = models.EmailField(unique=True)
    is_active = models.BooleanField(default=False)
    verification_code = models.CharField(max_length=128, null=True, blank=True)
    verification_code_expiry = models.DateTimeField(null=True, blank=True)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return f"{self.email} ({self.role})"


class Volunteer(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    date_of_birth = models.DateField()
    school_or_organization = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.user.username} ({self.school_or_organization})"


class Organization(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    date_of_establishment = models.DateField()
    registration_number = models.CharField(max_length=50, unique=True, blank=True, null=True)
    organization_type = models.CharField(max_length=50)
    website = models.URLField(blank=True, null=True)
    description = models.TextField(max_length=500, blank=True, null=True)
    logo = models.ImageField(upload_to="org_logos/", blank=True, null=True)
    address = models.CharField(max_length=200)
    city = models.CharField(max_length=100)
    country = models.CharField(max_length=100)
    join_code = models.CharField(max_length=10, unique=True, default=generate_join_code)

    def __str__(self):
        return f"{self.name}, code: {self.join_code}"
    



class Admin(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    organization = models.OneToOneField('Organization', on_delete=models.CASCADE, related_name='admin')
    phone_number = models.CharField(max_length=15, blank=True)
    job_title = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return f"{self.user.username} ({self.job_title})"
    

class Membership(models.Model):
    ROLE_CHOICES = [
        ('volunteer', 'Volunteer'),
        ('executive', 'Executive'),
        ('admin', 'Admin'),
    ]
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('pending', 'Pending'),
    ]

    volunteer = models.ForeignKey('Volunteer', on_delete=models.CASCADE)
    organization = models.ForeignKey('Organization', on_delete=models.CASCADE)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='volunteer')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    join_date = models.DateTimeField(default=timezone.now)

    class Meta:
        unique_together = ('volunteer', 'organization')

    def __str__(self):
        return f"{self.volunteer} - {self.organization} ({self.role})"


class Event(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name="events")
    name = models.CharField(max_length=100)
    description = models.TextField()
    date = models.DateField()
    end_date = models.DateField(blank=True, null=True)
    time = models.TimeField(blank=True, null=True)
    location = models.CharField(max_length=200)
    is_public = models.BooleanField(default=True)
    service_hours = models.DecimalField(max_digits=5, decimal_places=2)
    max_participants = models.PositiveIntegerField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.organization.name})"

    @property
    def participant_count(self):
        return self.participants.count()


class Participation(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    volunteer = models.ForeignKey(Volunteer, on_delete=models.CASCADE, related_name="participations")
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name="participants")
    date_participated = models.DateField(auto_now_add=True)
    hours_completed = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    verified = models.BooleanField(default=False)
    status = models.CharField(
        max_length=20,
        choices=[
            ('joined', 'Joined'),
            ('completed', 'Completed'),
            ('cancelled', 'Cancelled')
        ],
        default='joined'
    )
    certificate_code = models.CharField(max_length=12, unique=True, blank=True, null=True)

    def save(self, *args, **kwargs):
        if not self.certificate_code:
            self.certificate_code = uuid.uuid4().hex[:12].upper()
        super().save(*args, **kwargs)

    class Meta:
        unique_together = ('volunteer', 'event')

    def __str__(self):
        return f"{self.volunteer.user.username} - {self.event.name}"