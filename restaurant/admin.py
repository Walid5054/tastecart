from django.contrib import admin

from restaurant.models import Menu, Restaurant

# Register your models here.

@admin.register(Restaurant)
class RestaurantAdmin(admin.ModelAdmin):
    list_display = ("restaurant_name", "owner", "location", "rating")
    search_fields = ("restaurant_name", "owner__username", "location")
    list_filter = ("location", "rating")


@admin.register(Menu)
class MenuAdmin(admin.ModelAdmin):
    list_display = ("item_name", "restaurant", "price", "is_available")
    search_fields = ("item_name", "restaurant__restaurant_name")
    list_filter = ("restaurant", "is_available", "category")
    ordering = ("-price",)