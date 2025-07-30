from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from .models import User  # Assuming a custom User model with `user_type`
from django.contrib import messages


def registration(request):
    if request.method == "POST":
        role = request.POST.get("role")  # 'owner' or 'user'
        email = request.POST.get("email")
        name = request.POST.get("name")
        password = request.POST.get("password")

        if User.objects.filter(email=email).exists():
            return render(
                request, "authentication/reg.html", {"error": "Email already exists."}
            )

        # Common user data
        user_data = {
            "name": name,
            "email": email,
            "user_type": "Owner" if role == "owner" else "User",
            "password": password,
        }

        # Additional owner-only data
        if role == "owner":
            user_data["restaurant_name"] = request.POST.get("restaurant_name")
            user_data["phone"] = request.POST.get("phone")

        # Create user
        user = User.objects.create(**user_data)
        user.set_password(password)
        user.save()

        # Authenticate and login
        authenticated_user = authenticate(email=email, password=password)
        print(f"Authenticated User: {authenticated_user}")  # Debugging line
        if authenticated_user is not None:
            login(request, authenticated_user)
            return redirect("index")

    return render(request, "authentication/reg.html")


def sign_in(request):
    if request.method == "POST":
        email = request.POST.get("email")
        password = request.POST.get("password")
        role = request.POST.get("role")
        print(f"Role: {role}, Email: {email}, Password: {password}")  # Debugging line
        if User.objects.filter(email=email, user_type=role).exists() is False:
            messages.error(request, "User does not exist or role mismatch.")
            return render(request, "authentication/sign_in.html")
        user = authenticate(email=email, password=password, user_type=role)
        print(f"User: {user}")
        if user is not None:
            login(request, user)
            messages.success(request, "Login successful.")
            return redirect("index") if role == "user" else redirect("owner_dashboard")
        else:
            messages.error(request, "Invalid email or password or role")
            return render(request, "authentication/sign_in.html")
    return render(request, "authentication/sign_in.html")


def sign_out(request):
    logout(request)
    return redirect("index")
