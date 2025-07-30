from django.shortcuts import render

# Create your views here.

def index(request):
    restaurants= [
        {"name": "Restaurant A", "location": "Location A", "rating": 4.5},
        {"name": "Restaurant B", "location": "Location B", "rating": 4.0},
        {"name": "Restaurant C", "location": "Location C", "rating": 3.5},
    ]
    return render(request, 'home/home.html')

def owner_dashboard(request):
    # Logic for owner dashboard can be added here
    return render(request, 'home/owner_dashboard.html')