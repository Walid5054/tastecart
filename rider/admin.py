from django.contrib import admin

from rider.models import Rider

# Register your models here.


@admin.register(Rider)
class RiderAdmin(admin.ModelAdmin):
    list_display = ("user", "order", "is_delivered", "is_accepted")
    list_filter = ("is_delivered", "is_accepted")
    search_fields = ("user__username", "order__id")
