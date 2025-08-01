from . import views
from django.urls import path

urlpatterns = [
    path("register/", views.registration, name="registration"),
    path("login/", views.sign_in, name="login"),
    path("logout/", views.sign_out, name="logout"),
    path("profile/", views.view_profile, name="view_profile"),
    path("rider_registration/", views.rider_registration, name="rider_registration"),
    path("rider_login/", views.rider_login, name="rider_login"),
    path("rider_profile/", views.rider_profile, name="rider_profile"),
]
