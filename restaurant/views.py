from django.contrib import messages
from django.shortcuts import get_object_or_404, redirect, render
from order.models import Cart, Order
from restaurant.forms import MenuForm, RestaurantForm
from restaurant.models import Menu, Restaurant
from restaurant.decorators import owner_required

# Create your views here.


def restaurant_view(request, slug):
    restaurant = Restaurant.objects.get(slug=slug)

    menu_items = Menu.objects.filter(restaurant=restaurant)
    return render(
        request,
        "restaurant/restaurant.html",
        {"restaurant": restaurant, "menu_items": menu_items},
    )


def restaurants_view(request):
    if request.method == "POST":
        place = request.POST.get("place")
        if place:
            restaurants = Restaurant.objects.filter(location__icontains=place)
            return render(request, "restaurant/restaurants.html", {"restaurants": restaurants})
    restaurants = Restaurant.objects.all()
    return render(request, "restaurant/restaurants.html", {"restaurants": restaurants})


def menu(request):
    menu_items = Menu.objects.all()
    return render(request, "restaurant/menu.html", {"menu_items": menu_items})



@owner_required
def restaurant_settings(request):
    user = request.user

    try:
        restaurant = Restaurant.objects.get(owner=user)
    except Restaurant.DoesNotExist:
        messages.error(request, "Restaurant not found. Please contact support.")
        return redirect("index")

    if request.method == "POST":
        form = RestaurantForm(request.POST, request.FILES, instance=restaurant)

        if form.is_valid():
            form.save()
            messages.success(request, "Restaurant details updated successfully!")
            return redirect("restaurant_settings")
        else:
            messages.error(request, "Please correct the errors below.")
    else:
        form = RestaurantForm(instance=restaurant)
    orders = Order.objects.filter(
        cart__item__restaurant__owner=user, status="Preparing"
    ).order_by("-created_at")
    context = {
        "restaurant": restaurant,
        "form": form,
        "orders": orders,
    }

    return render(request, "restaurant/restaurant_settings.html", context)


@owner_required
def owner_dashboard(request):
    user = request.user
    menu_items = Menu.objects.filter(restaurant__owner=user)
    restaurant = Restaurant.objects.get(owner=user)
    form = MenuForm()
    edit_form = None
    edit_item = None

    # Check if editing an item
    edit_id = request.GET.get("edit")
    if edit_id:
        edit_item = get_object_or_404(Menu, id=edit_id, restaurant=restaurant)
        edit_form = MenuForm(instance=edit_item)

    if request.method == "POST":
        action = request.POST.get("action")

        if action == "edit":
            # Handle edit using Django form
            item_id = request.POST.get("item_id")
            menu_item = get_object_or_404(Menu, id=item_id, restaurant=restaurant)
            edit_form = MenuForm(request.POST, request.FILES, instance=menu_item)

            if edit_form.is_valid():
                edit_form.save()
                messages.success(request, "Menu item updated successfully!")
                return redirect("owner_dashboard")
            else:
                edit_item = menu_item  # Keep the modal open with errors

        elif action == "delete":
            # Handle delete
            item_id = request.POST.get("item_id")
            menu_item = get_object_or_404(Menu, id=item_id, restaurant=restaurant)
            menu_item.delete()
            messages.success(request, "Menu item deleted successfully!")
            return redirect("owner_dashboard")

        else:
            # Handle add new item
            form = MenuForm(request.POST, request.FILES)
            if form.is_valid():
                menu_item = form.save(commit=False)
                menu_item.restaurant = restaurant
                menu_item.save()
                messages.success(request, "Menu item added successfully!")
                return redirect("owner_dashboard")

    orders = Order.objects.filter(
        cart__item__restaurant__owner=user, status="Preparing"
    ).order_by("-created_at")
    context = {
        "menu_items": menu_items,
        "form": form,
        "edit_form": edit_form,
        "edit_item": edit_item,
        "orders": orders,
    }

    return render(request, "restaurant/dashboard.html", context)
