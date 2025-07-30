from django.shortcuts import render

from restaurant.models import Menu, Restaurant

# Create your views here.


def restaurant_view(request,boom):
    restaurant= Restaurant.objects.get(id=boom)
    menu_items = Menu.objects.filter(restaurant=restaurant)
    return render(request, "restaurant/restaurant.html", {"restaurant": restaurant, "menu_items": menu_items})

def restaurants_view(request):
    restaurants = Restaurant.objects.all()
    return render(request, "restaurant/restaurants.html", {"restaurants": restaurants})


def menu(request):
    menu_items=Menu.objects.all()
    return render(request, "restaurant/menu.html", {"menu_items": menu_items})