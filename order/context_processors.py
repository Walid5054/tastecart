from .models import Cart


def cart_count(request):
    cart_count = 0
    if request.user.is_authenticated:
        # Count only cart items that are not ordered and have quantity > 0
        cart_count = Cart.objects.filter(
            user=request.user, ordered=False, quantity__gt=0
        ).count()

    return {"cart_count": cart_count}
