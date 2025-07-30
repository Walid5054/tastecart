from django.contrib import admin

from authentication.models import User

# Register your models here.

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('email', 'name', 'user_type', 'restaurant_name', 'phone')
    search_fields = ('email', 'name')
    list_filter = ('user_type',)
    ordering = ('-id',)

    def restaurant_name(self, obj):
        return obj.restaurant_name if obj.user_type == 'Owner' else 'N/A'
    
    def phone(self, obj):
        return obj.phone if obj.user_type == 'Owner' else 'N/A'