
from django.db import models

from authentication.models import User


# Create your models here.
class Restaurant(models.Model):
    CATEGORIES = [
        ("Chinese", "Chinese"),
        ("Indian", "Indian"),
        ("Bengali", "Bengali"),
        ("Fast Food", "Fast Food"),
    ]
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    restaurant_name = models.CharField(max_length=255)
    category = models.CharField(max_length=50, choices=CATEGORIES, default="Bengali")
    restaurant_image = models.ImageField(
        upload_to="restaurant_images/", blank=True, null=True
    )
    inside_image1 = models.ImageField(
        upload_to="restaurant_inside_images/", blank=True, null=True
    )
    inside_image2 = models.ImageField(
        upload_to="restaurant_inside_images/", blank=True, null=True
    )
    inside_image3 = models.ImageField(
        upload_to="restaurant_inside_images/", blank=True, null=True
    )
    phone = models.CharField(max_length=15, blank=True, null=True)
    email = models.CharField(max_length=50, blank=True, null=True)
    location = models.CharField(max_length=255, blank=True, null=True)
    address = models.CharField(max_length=255, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    about = models.TextField(blank=True, null=True)
    opening_time = models.TimeField(blank=True, null=True)
    closing_time = models.TimeField(blank=True, null=True)
    chef_name = models.CharField(max_length=255, blank=True, null=True)
    chef_image = models.ImageField(upload_to="chef_images/", blank=True, null=True)
    rating = models.FloatField(default=0.0)
    offers = models.IntegerField(default=0, blank=True, null=True)
    estimated_delivery_time = models.IntegerField(
        default=30, blank=True, null=True
    )  # in minutes
    slug = models.SlugField(max_length=255, unique=True, blank=True, null=True)

    def __str__(self):
        return self.restaurant_name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = self.restaurant_name.lower().replace(" ", "-")
        if self.pk: 
            original = Restaurant.objects.get(pk=self.pk)
            if self.owner.user_type == "owner" and self.rating != original.rating:
                raise ValueError(
                    "Owners are not allowed to modify the restaurant rating."
                )
        else:
            if self.owner.user_type != "owner":
                raise ValueError("Only owners can create restaurants.")
            self.restaurant_name = self.owner.restaurant_name
            self.rating = 0.0

        super().save(*args, **kwargs)


class Menu(models.Model):
    CATEGORIES = [
        ("Appetizer", "Appetizer"),
        ("Main Course", "Main Course"),
        ("Dessert", "Dessert"),
        ("Beverage", "Beverage"),
    ]
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE)
    item_name = models.CharField(max_length=255)
    category = models.CharField(max_length=50, choices=CATEGORIES, default="Main Course")
    description = models.TextField(blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.ImageField(upload_to="menu_images/", blank=True, null=True)
    estimated_time_delivery = models.IntegerField(default=30, blank=True, null=True)  # in minutes
    rating= models.FloatField(default=0.0)
    discount= models.DecimalField(
        max_digits=5, decimal_places=2, default=0.0, blank=True, null=True
    )  # in percentage
    is_available = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.item_name} - {self.restaurant.restaurant_name}"