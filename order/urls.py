from . import views
from django.urls import path

urlpatterns = [
    path("cart", views.cart, name="cart"),
    path(
        "add-to-cart/<str:res_slug>/<int:item_id>/<int:quantity>/",
        views.add_to_cart,
        name="add_to_cart",
    ),
    path("cart/count/", views.cart_count_view, name="cart_count"),
    path("cart/update/", views.update_cart_quantity, name="update_cart_quantity"),
    path("cart/remove/", views.remove_from_cart, name="remove_from_cart"),
    path("checkout/<int:user>/", views.checkout, name="checkout"),
    path("orders/", views.orders, name="orders"),
    path("update-order-status/", views.update_order_status, name="update_order_status"),
    path("status/", views.order_status, name="order_status"),
    path("modify-order/", views.modify_order, name="modify_order"),
    path("cancel-order/", views.cancel_order, name="cancel_order"),
]
