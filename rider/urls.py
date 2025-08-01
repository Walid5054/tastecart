from . import views
from django.urls import path
from . import views

urlpatterns = [
    path("rider_dashboard/", views.rider_dashboard, name="rider_dashboard"),
]
