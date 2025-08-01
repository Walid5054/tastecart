from django.contrib import admin

from home.models import Feedback, OrderHistory, notification


# Register your models here.
@admin.register(notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ("user", "message", "is_read", "created_at")
    search_fields = ("user__username", "message")
    list_filter = ("is_read", "created_at")


@admin.register(OrderHistory)
class OrderHistoryAdmin(admin.ModelAdmin):
    list_display = ("user", "order__cart", "created_at")
    search_fields = ("user__name", "order__id")
    list_filter = ("created_at",)


@admin.register(Feedback)
class FeedbackAdmin(admin.ModelAdmin):
    list_display = ("user", "order", "restaurant", "rating", "created_at")
    search_fields = ("user__username", "order__id", "restaurant__restaurant_name")
    list_filter = ("rating", "created_at")
    raw_id_fields = ("order", "restaurant")
