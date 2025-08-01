from django.shortcuts import redirect, render
from django.db.models import Q

from order.models import Order
from rider.models import Rider

# Create your views here.


def rider_dashboard(request):
    new_orders = Order.objects.filter(
        Q(
            is_delivered=False,
            is_accepted=True,
            status="Preparing",
            cart__item__restaurant__location__icontains=request.user.city,
        )
        | Q(
            is_delivered=False,
            is_accepted=True,
            status="Completed",
            cart__item__restaurant__location__icontains=request.user.city,
        )
    )
    picked_orders = Rider.objects.filter(
        user=request.user, is_delivered=False, is_accepted=True, in_transit=False
    )
    ongoing_deliveries = Rider.objects.filter(
        user=request.user, is_delivered=False, is_accepted=True, in_transit=True
    )
    delivered_orders = Rider.objects.filter(
        user=request.user, is_delivered=True, is_accepted=True
    )

    return render(
        request,
        "rider/rider_dashboard.html",
        {
            "new_orders": new_orders,
            "ongoing_deliveries": ongoing_deliveries,
            "delivered_orders": delivered_orders,
            "picked_orders": picked_orders,
        },
    )


def accept_order(request, id):
    order = Order.objects.get(id=id)
    Rider.objects.get_or_create(user=request.user, order=order, is_accepted=True)
    return redirect("rider_dashboard")


def picked_orders(request, id):
    rider = Rider.objects.get(id=id, user=request.user)
    if not rider.is_accepted:
        return redirect("rider_dashboard")

    rider.in_transit = True
    rider.save()
    return redirect("rider_dashboard")


def delivered_order(request, id):
    rider = Rider.objects.get(id=id, user=request.user)
    if not rider.is_accepted:
        return redirect("rider_dashboard")

    rider.is_delivered = True
    rider.save()
    return redirect("rider_dashboard")
