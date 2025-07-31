from django.contrib import admin

from authentication.models import Profile, User

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
    

@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'address', 'profile_image')
    search_fields = ('user__email', 'user__name')
    ordering = ('-id',)

    def user(self, obj):
        return obj.user.email if obj.user else 'N/A'
    
    def address(self, obj):
        return obj.address if obj.address else 'N/A'
    
    def profile_image(self, obj):
        return obj.profile_image.url if obj.profile_image else 'No Image'