from django.contrib import messages
from django.db.models import Q
from django.shortcuts import get_object_or_404, redirect, render
from home.models import Feedback, OrderHistory
from order.models import Order
from restaurant.forms import MenuForm, RestaurantForm
from restaurant.models import Menu, Restaurant
from restaurant.decorators import owner_required


def restaurant_view(request, slug):
    restaurant = get_object_or_404(Restaurant, slug=slug)
    menu_items = Menu.objects.filter(restaurant=restaurant)
    reviews = Feedback.objects.filter(restaurant=restaurant).order_by("-created_at")
    print(restaurant, "is_open:", restaurant.is_open)
    is_closed = True
    if restaurant.is_open:
        is_closed = False
    print(f"Restaurant is closed: {is_closed}")
    if request.method == "POST":
        review = request.POST.get("review", "").strip()
        rating = request.POST.get("rating")

        has_ordered = OrderHistory.objects.filter(
            user=request.user, order__cart__item__restaurant=restaurant
        ).exists()

        if has_ordered and review and rating:
            try:
                Feedback.objects.create(
                    restaurant=restaurant,
                    user=request.user,
                    comment=review,
                    rating=int(rating),
                )
                messages.success(request, "Thank you for your review!")
            except ValueError:
                messages.error(request, "Invalid rating value.")
        else:
            messages.warning(
                request, "You must place an order before leaving a review."
            )
    context = {
        "restaurant": restaurant,
        "menu_items": menu_items,
        "reviews": reviews,
        "is_closed": is_closed,
    }
    return render(request, "restaurant/restaurant.html", context)


def restaurants_view(request):
    if request.method == "POST":
        place = request.POST.get("place")
        if place:
            restaurants = Restaurant.objects.filter(location__icontains=place).order_by('-rating')
            return render(
                request, "restaurant/restaurants.html", {"restaurants": restaurants}
            )
    restaurants = Restaurant.objects.all().order_by("-rating")
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
    orders = (
        Order.objects.filter(
            Q(cart__item__restaurant__owner=user, is_accepted=False)
            | Q(cart__item__restaurant__owner=user, status="Preparing")
            | Q(cart__item__restaurant__owner=user, status="Pending")
        )
        .order_by("-created_at")
        .exclude(status="Cancelled")
    )
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
                return redirect("dashboard")
            else:
                edit_item = menu_item  # Keep the modal open with errors

        elif action == "delete":
            # Handle delete
            item_id = request.POST.get("item_id")
            menu_item = get_object_or_404(Menu, id=item_id, restaurant=restaurant)
            menu_item.delete()
            messages.success(request, "Menu item deleted successfully!")
            return redirect("dashboard")

        else:
            # Handle add new item
            form = MenuForm(request.POST, request.FILES)
            if form.is_valid():
                menu_item = form.save(commit=False)
                menu_item.restaurant = restaurant
                menu_item.save()
                messages.success(request, "Menu item added successfully!")
                return redirect("dashboard")

    orders = (
        Order.objects.filter(
            Q(cart__item__restaurant__owner=user, is_accepted=False)
            | Q(cart__item__restaurant__owner=user, status="Preparing")
            | Q(cart__item__restaurant__owner=user, status="Pending")
        )
        .order_by("-created_at")
        .exclude(status="Cancelled")
    )
    if orders:
        messages.warning(request,"You have new orders")
    context = {
        "menu_items": menu_items,
        "form": form,
        "edit_form": edit_form,
        "edit_item": edit_item,
        "orders": orders,
    }

    return render(request, "restaurant/dashboard.html", context)
