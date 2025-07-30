from . import views
from django.urls import path

urlpatterns = [
    path("", views.index, name="index"),
    path("owner-dashboard/", views.owner_dashboard, name="owner_dashboard"),
]
