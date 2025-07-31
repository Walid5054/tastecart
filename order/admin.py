from django.contrib import admin

from order.models import Cart, Order

# Register your models here.
@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ('user', 'item', 'quantity', 'total_price', 'created_at')
    search_fields = ('user__username', 'item__name')
    list_filter = ('created_at',)


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('user', 'cart', 'restaurant', 'status', 'total_price', 'created_at')
    search_fields = ('user__username', 'restaurant__name', 'status')
    list_filter = ('status', 'created_at')
    raw_id_fields = ('cart',)