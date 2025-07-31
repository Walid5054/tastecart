from django.shortcuts import redirect
from django.contrib import messages
from functools import wraps


def owner_required(view_func):
    @wraps(view_func)
    def _wrapped_view(request, *args, **kwargs):
        if not request.user.is_authenticated:
            messages.error(request, "Please log in to access this page.")
            return redirect("login")

        if request.user.user_type != "owner":
            messages.error(request, "Only restaurant owners can access this page.")
            return redirect("index")

        return view_func(request, *args, **kwargs)

    return _wrapped_view
