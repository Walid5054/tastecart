from django.contrib import messages
from django.shortcuts import get_object_or_404, redirect, render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
import json

from order.models import Cart
import restaurant
from restaurant.models import Menu

# Create your views here.


def cart(request):
    user = request.user
    cart_items = Cart.objects.filter(user=user)
    cart_total = sum(item.total_price for item in cart_items)
    return render(
        request, "order/cart.html", {"cart_items": cart_items, "cart_total": cart_total}
    )


def add_to_cart(request, res_slug, item_id, quantity=1):
    user = request.user
    item = get_object_or_404(Menu, id=item_id)

    # Check if the item is already in the cart
    cart_item, created = Cart.objects.get_or_create(user=user, item=item)

    if not created:
        cart_item.quantity += quantity
    else:
        cart_item.quantity = quantity

    cart_item.save()

    messages.success(request, f"{item.item_name} has been added to your cart.")
    return redirect(request.META.get("HTTP_REFERER", request.path))


@login_required
@csrf_exempt
def update_cart_quantity(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            item_id = data.get("item_id")
            change = data.get("change")

            cart_item = get_object_or_404(Cart, id=item_id, user=request.user)
            cart_item.quantity += change

            # If quantity becomes 0 or negative, remove the item
            if cart_item.quantity <= 0:
                cart_item.delete()

                # Calculate cart total
                cart_total = sum(
                    item.total_price for item in Cart.objects.filter(user=request.user)
                )

                return JsonResponse(
                    {
                        "success": True,
                        "new_quantity": 0,
                        "cart_total": f"{cart_total:.2f}",
                    }
                )
            else:
                cart_item.save()

                # Calculate cart total
                cart_total = sum(
                    item.total_price for item in Cart.objects.filter(user=request.user)
                )

                return JsonResponse(
                    {
                        "success": True,
                        "new_quantity": cart_item.quantity,
                        "item_price": f"{cart_item.item.price:.2f}",
                        "item_total": f"{cart_item.total_price:.2f}",
                        "cart_total": f"{cart_total:.2f}",
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

            cart_item = get_object_or_404(Cart, id=item_id, user=request.user)
            cart_item.delete()

            # Calculate cart total after removal
            cart_total = sum(
                item.total_price for item in Cart.objects.filter(user=request.user)
            )

            return JsonResponse(
                {
                    "success": True,
                    "cart_total": f"{cart_total:.2f}",
                    "cart_items": Cart.objects.filter(user=request.user).count(),
                }
            )

        except Cart.DoesNotExist:
            return JsonResponse({"success": False, "message": "Cart item not found"})
        except Exception as e:
            return JsonResponse({"success": False, "message": str(e)})

    return JsonResponse({"success": False, "message": "Invalid request method"})
