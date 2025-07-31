from . import views
from django.urls import path

urlpatterns = [
    path("cart", views.cart, name="cart"),
    path(
        "add-to-cart/<str:res_slug>/<int:item_id>/<int:quantity>/",
        views.add_to_cart,
        name="add_to_cart",
    ),
    path("cart/update/", views.update_cart_quantity, name="update_cart_quantity"),
    path("cart/remove/", views.remove_from_cart, name="remove_from_cart"),
]
