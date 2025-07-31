from django.shortcuts import redirect, render, get_object_or_404
from django.contrib import messages
from authentication.models import User

from restaurant.models import Menu, Restaurant



def index(request):
    menu_items = Menu.objects.filter(rating__gte=4).order_by("-rating")[:5]
    return render(request, "home/home.html", {"menu_items": menu_items})





def blog(request):
    return render(request, "home/blog.html")


def about(request):
    return render(request, "home/about_us.html")


