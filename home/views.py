from django.shortcuts import redirect, render, get_object_or_404
from django.contrib import messages
from authentication.models import User
from restaurant.forms import MenuForm
from restaurant.models import Menu, Restaurant


def index(request):
    menu_items = Menu.objects.filter(rating__gte=4).order_by("-rating")[:5]
    return render(request, "home/home.html", {"menu_items": menu_items})


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

    context = {
        "menu_items": menu_items,
        "form": form,
        "edit_form": edit_form,
        "edit_item": edit_item,
    }

    return render(request, "home/dashboard.html", context)


def blog(request):
    return render(request, "home/blog.html")


def about(request):
    return render(request, "home/about_us.html")
