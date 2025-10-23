from django.contrib import admin
from .models import Volunteer, Admin, User, Organization, Event, Membership, Participation

# Register your models here.

admin.site.register(User)
admin.site.register(Volunteer)
admin.site.register(Admin)
admin.site.register(Organization)
admin.site.register(Event)
admin.site.register(Membership)
admin.site.register(Participation)
