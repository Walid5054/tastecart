from . import views
from django.urls import path

urlpatterns = [
    path("restaurant/<int:boom>", views.restaurant_view, name="restaurant_view"),
    path("dashboard", views.owner_dashboard, name="dashboard"),
    path("restaurant-settings", views.restaurant_settings, name="restaurant_settings"),
    path("restaurants/", views.restaurants_view, name="restaurants_view"),
    path("menu/", views.menu, name="menu"),
]
