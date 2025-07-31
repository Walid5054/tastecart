from .models import Cart


def cart_count(request):
    cart_count = 0
    if request.user.is_authenticated:
        # Count only cart items that are not ordered and have quantity > 0
        cart_count = Cart.objects.filter(
            user=request.user, ordered=False, quantity__gt=0
        ).count()
        print(f"Cart count for user {request.user.username}: {cart_count}")

    return {"cart_count": cart_count}
