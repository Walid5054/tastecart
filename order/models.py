from django.conf import settings
from django.contrib.auth.models import User
from django.db import models

from restaurant.models import Menu, Restaurant

# Create your models here.


class Cart(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    item = models.ForeignKey(Menu, verbose_name="Menu Item", on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    total_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Cart {self.id} for {self.user}"

    def save(self, *args, **kwargs):
        if self.quantity < 1:
            self.quantity = 1
        self.total_price = self.item.price * self.quantity
        super().save(*args, **kwargs)

    @property
    def restaurant(self):
        return self.item.restaurant


class Order(models.Model):
    choices = [
        ("Preparing", "Preparing"),
        ("Completed", "Completed"),
        ("Cancelled", "Cancelled"),
    ]
    PAYMENT_METHOD = [
        ("Cash on Delivery", "Cash on Delivery"),
        ("Online Payment", "Online Payment"),
    ]
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE)
    restaurant = models.ForeignKey(
        Restaurant, verbose_name="Restaurant", on_delete=models.CASCADE
    )
    status = models.CharField(max_length=20, choices=choices, default="Preparing")
    total_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    is_accepted = models.BooleanField(default=False)
    is_delivered = models.BooleanField(default=False)
    payment_method = models.CharField(
        max_length=50, choices=PAYMENT_METHOD, default="Cash on Delivery"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order {self.id} by {self.user.username}"
