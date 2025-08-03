from django.conf import settings
from django.contrib.auth.models import User
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver

from home.models import OrderHistory, notification
from order.models import Order

# Create your models here.


class Rider(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    is_delivered = models.BooleanField(default=False)
    in_transit = models.BooleanField(default=False)
    is_accepted = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user.name} - {self.order.id}"

    def save(self, *args, **kwargs):
        if self.is_delivered and not self.is_accepted:
            raise ValueError(
                "Order cannot be marked as delivered without being accepted first."
            )
        if self.user.user_type != "rider":
            raise ValueError("User is not a rider.")
        super().save(*args, **kwargs)


@receiver(post_save, sender=Rider)
def update_order_status(sender, instance, **kwargs):
    if instance.is_accepted and not instance.in_transit and not instance.is_delivered:
        status = Order.objects.get(id=instance.order.id).status
        if status == "Completed":
            Order.objects.filter(id=instance.order.id).update(
                is_accepted=True, status="Completed with Rider"
            )
        else:
            Order.objects.filter(id=instance.order.id).update(
                is_accepted=True, status="Rider Assigned"
            )
        notification.objects.create(
            user=instance.order.user,
            message=f"Rider {instance.user} has accepted your order {instance.order.cart.item.item_name} from {instance.order.cart.item.restaurant}. Once it's cooked, it will be picked up for delivery.",
        )
    if instance.in_transit and instance.is_accepted and not instance.is_delivered:
        Order.objects.filter(id=instance.order.id).update(status="On the way")
        notification.objects.create(
            user=instance.order.user,
            message=f"Rider {instance.user} is on the way with your order {instance.order.cart.item.item_name} from {instance.order.cart.item.restaurant}.",
        )
    if instance.is_delivered and instance.is_accepted and instance.in_transit:
        Order.objects.filter(id=instance.order.id).update(
            is_delivered=True, status="Delivered"
        )
        OrderHistory.objects.create(user=instance.order.user, order=instance.order)
        notification.objects.create(
            user=instance.order.user,
            message=f"Your order {instance.order.cart.item.item_name} has been delivered.",
        )
