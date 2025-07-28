from django.shortcuts import render

# Create your views here.

def index(request):
    return render(request, 'home/home.html')

def owner_dashboard(request):
    # Logic for owner dashboard can be added here
    return render(request, 'home/owner_dashboard.html')