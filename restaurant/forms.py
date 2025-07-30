from django import forms
from .models import Menu


class MenuForm(forms.ModelForm):
    class Meta:
        model = Menu
        fields = [
            "item_name",
            "description",
            "category",
            "price",
            "estimated_time_delivery",
            "rating",
            "discount",
            "is_available",
            "image",
        ]
        labels = {
            "item_name": "Item Name",
            "description": "Description",
            "category": "Category",
            "price": "Price (৳)",
            "estimated_time_delivery": "Estimated Delivery Time (min)",
            "rating": "Rating (0 - 5)",
            "discount": "Discount (%)",
            "is_available": "Available?",
            "image": "Image",
        }
        widgets = {
            "item_name": forms.TextInput(
                attrs={
                    "class": "w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-red-400",
                    "placeholder": "e.g. Butter Chicken",
                }
            ),
            "description": forms.Textarea(
                attrs={
                    "class": "w-full border border-gray-300 p-2 rounded resize-none focus:outline-none focus:ring-2 focus:ring-red-400",
                    "rows": 3,
                    "placeholder": "Describe the item briefly",
                }
            ),
            "category": forms.Select(
                attrs={
                    "class": "w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-red-400",
                }
            ),
            "price": forms.NumberInput(
                attrs={
                    "class": "w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-red-400",
                    "step": "0.01",
                    "placeholder": "e.g. 249.99",
                }
            ),
            "estimated_time_delivery": forms.NumberInput(
                attrs={
                    "class": "w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-red-400",
                    "placeholder": "e.g. 30",
                }
            ),
            "rating": forms.NumberInput(
                attrs={
                    "class": "w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-red-400",
                    "step": "0.1",
                    "placeholder": "e.g. 4.5",
                }
            ),
            "discount": forms.NumberInput(
                attrs={
                    "class": "w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-red-400",
                    "step": "0.01",
                    "placeholder": "e.g. 10.00",
                }
            ),
            "is_available": forms.CheckboxInput(
                attrs={
                    "class": "accent-red-500 scale-125",
                }
            ),
            "image": forms.ClearableFileInput(
                attrs={
                    "class": "w-full border border-gray-300 p-2 rounded bg-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-red-50 file:text-red-700 hover:file:bg-red-100",
                }
            ),
        }
