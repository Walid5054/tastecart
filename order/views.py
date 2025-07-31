from django.shortcuts import render

# Create your views here.

def order_view(request):
    # Logic for handling order view
    return render(request, 'order/orders.html')