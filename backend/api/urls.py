from django.urls import path
from . import views

urlpatterns = [
    path('my-volunteer-data/', views.get_my_volunteer_data),
    path('my-admin-data/', views.get_my_admin_data),
    path('get-volunteer-data/<uuid:volunteer_id>/', views.get_volunteer_data_by_id),
    path('get-admin-data/<uuid:admin_id>/', views.get_admin_data_by_id),
    path('update-volunteer-data/', views.update_my_volunteer_data),
    path('update-admin-data/', views.update_my_admin_data),
    path('token/', views.CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', views.CustomTokenRefreshView.as_view(), name='token_refresh'),
    path('register/', views.register_user),
    path('register-organization/', views.register_organization),
    path('authenticated/', views.authenticated),
    path('logout/', views.logout_user),
    path('organizations/join/', views.join_organization_by_code),
    path('organizations/quit/', views.quit_organization_by_code),
    path('get-my-events-as-volunteer/', views.get_my_events_as_volunteer),
    path('get-my-events-as-admin/', views.get_my_events_as_admin),
    path('create-event/', views.create_event),
    path('update-event/<uuid:event_id>/', views.update_event),
    path('delete-event/<uuid:event_id>/', views.delete_event),
    path('events/<uuid:event_id>/join/', views.join_event),
    path('events/<uuid:event_id>/cancel/', views.cancel_participation),
    path('participations-as-volunteer/', views.get_my_participations_as_volunteer),
    path('participations-as-admin/<uuid:event_id>/', views.get_participations_as_admin),
    path('participations/<uuid:participation_id>/complete/', views.mark_participation_completed),
]