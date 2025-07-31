from django.shortcuts import redirect, render, get_object_or_404
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from authentication.models import User
from .models import notification

from restaurant.models import Menu, Restaurant


def index(request):
    menu_items = Menu.objects.filter(rating__gte=4).order_by("-rating")[:5]
    return render(request, "home/home.html", {"menu_items": menu_items})


def blog(request):
    return render(request, "home/blog.html")


def about(request):
    return render(request, "home/about_us.html")


@login_required
@csrf_exempt
@require_POST
def mark_notifications_read(request):
    if request.user.is_authenticated:
        notification.objects.filter(user=request.user, is_read=False).update(
            is_read=True
        )
        return JsonResponse(
            {"success": True, "message": "Notifications marked as read"}
        )
    return JsonResponse({"success": False, "message": "User not authenticated"})









