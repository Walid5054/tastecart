from . import views
from django.urls import path
from . import views

urlpatterns = [
    path("rider_dashboard/", views.rider_dashboard, name="rider_dashboard"),
    path("accept_order/<int:id>/", views.accept_order, name="accept_order"),
    path("picked_orders/<int:id>/", views.picked_orders, name="picked_orders"),
    path("delivered_order/<int:id>/", views.delivered_order, name="delivered_order"),
]
