from django.shortcuts import render
from django.db.models import Q

from order.models import Order

# Create your views here.


def rider_dashboard(request):
    orders = Order.objects.filter(
        Q(
            is_delivered=False,
            is_accepted=True,
            status="Preparing",
            cart__item__restaurant__location__icontains=request.user.city
        ) | Q(
            is_delivered=False,
            is_accepted=True,
            status="Completed",
            cart__item__restaurant__location__icontains=request.user.city
        )
    )
    print(orders)
    return render(request, "rider/rider_dashboard.html", {"orders": orders})
