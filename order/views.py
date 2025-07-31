from django.contrib import messages
from django.shortcuts import get_object_or_404, redirect, render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
import json

from authentication.models import User
from home.models import notification
from order.models import Cart, Order
from restaurant.models import Menu

# Create your views here.


def cart(request):
    user = request.user
    cart_items = Cart.objects.filter(user=user, ordered=False)
    cart_total = sum(item.total_price for item in cart_items)
    return render(
        request, "order/cart.html", {"cart_items": cart_items, "cart_total": cart_total}
    )


def add_to_cart(request, res_slug, item_id, quantity=1):
    if not request.user.is_authenticated:
        if request.headers.get("X-Requested-With") == "XMLHttpRequest":
            return JsonResponse(
                {"success": False, "message": "Please login to add items to cart"}
            )
        else:
            messages.error(request, "Please login to add items to cart")
            return redirect("login")

    user = request.user
    item = get_object_or_404(Menu, id=item_id)

    # Check if the item is already in the cart
    cart_item, created = Cart.objects.get_or_create(
        user=user, item=item, ordered=False, defaults={"quantity": 0}
    )

    if not created:
        cart_item.quantity += quantity
    else:
        cart_item.quantity = quantity

    cart_item.save()

    # Handle AJAX requests
    if request.headers.get("X-Requested-With") == "XMLHttpRequest":
        cart_count = Cart.objects.filter(
            user=user, ordered=False, quantity__gt=0
        ).count()
        return JsonResponse(
            {
                "success": True,
                "message": f"{item.item_name} has been added to your cart.",
                "cart_count": cart_count,
            }
        )

    # Handle regular requests
    messages.success(request, f"{item.item_name} has been added to your cart.")
    return redirect(request.META.get("HTTP_REFERER", request.path))


@login_required
def cart_count_view(request):
    if request.headers.get("X-Requested-With") == "XMLHttpRequest":
        cart_count = Cart.objects.filter(
            user=request.user, ordered=False, quantity__gt=0
        ).count()
        return JsonResponse({"success": True, "cart_count": cart_count})

    return JsonResponse({"success": False, "message": "Invalid request"})


@login_required
@csrf_exempt
def update_cart_quantity(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            item_id = data.get("item_id")
            change = data.get("change")
            cart_item = get_object_or_404(
                Cart, id=item_id, user=request.user, ordered=False
            )

            cart_item.quantity += change

            if cart_item.quantity <= 0:
                cart_item.delete()
                cart_total = sum(
                    item.total_price
                    for item in Cart.objects.filter(user=request.user, ordered=False)
                )
                return JsonResponse(
                    {
                        "success": True,
                        "new_quantity": 0,
                        "cart_total": f"{cart_total:.2f}",
                        "cart_items": Cart.objects.filter(
                            user=request.user, ordered=False, quantity__gt=0
                        ).count(),
                    }
                )
            else:
                cart_item.save()

                cart_total = sum(
                    item.total_price
                    for item in Cart.objects.filter(user=request.user, ordered=False)
                )

                return JsonResponse(
                    {
                        "success": True,
                        "new_quantity": cart_item.quantity,
                        "item_price": f"{cart_item.item.price:.2f}",
                        "item_total": f"{cart_item.total_price:.2f}",
                        "cart_total": f"{cart_total:.2f}",
                        "cart_items": Cart.objects.filter(
                            user=request.user, ordered=False, quantity__gt=0
                        ).count(),
                    }
                )

        except Cart.DoesNotExist:
            return JsonResponse({"success": False, "message": "Cart item not found"})
        except Exception as e:
            return JsonResponse({"success": False, "message": str(e)})

    return JsonResponse({"success": False, "message": "Invalid request method"})


@login_required
@csrf_exempt
def remove_from_cart(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            item_id = data.get("item_id")

            cart_item = get_object_or_404(
                Cart, id=item_id, user=request.user, ordered=False
            )
            cart_item.delete()
            cart_total = sum(
                item.total_price
                for item in Cart.objects.filter(user=request.user, ordered=False)
            )

            return JsonResponse(
                {
                    "success": True,
                    "cart_total": f"{cart_total:.2f}",
                    "cart_items": Cart.objects.filter(
                        user=request.user, ordered=False, quantity__gt=0
                    ).count(),
                }
            )

        except Cart.DoesNotExist:
            return JsonResponse({"success": False, "message": "Cart item not found"})
        except Exception as e:
            return JsonResponse({"success": False, "message": str(e)})

    return JsonResponse({"success": False, "message": "Invalid request method"})


def checkout(request, user):
    user = get_object_or_404(User, id=user)
    if request.method == "POST":
        payment_method = request.POST.get("payment_method")
        if payment_method == "cod":
            payment_method = "Cash on Delivery"
        else:
            payment_method = "Online Payment"
        cart_items = Cart.objects.filter(user=user, ordered=False)
        for cart_item in cart_items:
            Order.objects.create(
                user=user, cart=cart_item, payment_method=payment_method
            )
        Cart.objects.filter(user=user, ordered=False).update(ordered=True)

        # Create notification for order confirmation
        notification.objects.create(
            user=user,
            message=f"Your order has been placed! Payment method: {payment_method}. Please wait for the confirmation. Thank you for choosing TasteCart.",
        )

        return redirect("index")



@login_required
def orders(request):
    user = request.user
    orders = Order.objects.filter(cart__item__restaurant__owner=user).order_by(
        "-created_at"
    )
    return render(request, "order/orders.html", {"orders": orders})


@login_required
@csrf_exempt
def update_order_status(request):
    if request.method == "POST":
        try:
            order_id = request.POST.get("order_id")
            action = request.POST.get("action")

            order = get_object_or_404(Order, id=order_id)

            # Check if the user owns the restaurant for this order
            if order.cart.item.restaurant.owner != request.user:
                return JsonResponse(
                    {"success": False, "message": "Unauthorized access"}
                )

            if action == "accept":
                order.is_accepted = True
                order.save()
                notification.objects.create(
                    user=order.user,
                    message="Your order has been accepted and is being prepared.",
                )
                message = "Order accepted successfully"
            elif action == "reject":
                order.status = "Cancelled"
                order.save()
                notification.objects.create(
                    user=order.user,
                    message="Your order has been rejected. Please contact us for more details.",
                )
                message = "Order rejected"
            elif action == "complete":
                order.status = "Completed"
                order.save()
                notification.objects.create(
                    user=order.user, message="Your order is ready for pickup/delivery!"
                )
                message = "Order marked as ready"
            elif action == "deliver":
                order.is_delivered = True
                order.save()
                notification.objects.create(
                    user=order.user,
                    message="Your order has been delivered. Thank you for choosing TasteCart!",
                )
                message = "Order marked as delivered"
            else:
                return JsonResponse({"success": False, "message": "Invalid action"})

            return JsonResponse({"success": True, "message": message})

        except Order.DoesNotExist:
            return JsonResponse({"success": False, "message": "Order not found"})
        except Exception as e:
            return JsonResponse({"success": False, "message": str(e)})

    return JsonResponse({"success": False, "message": "Invalid request method"})
