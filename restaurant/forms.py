from django import forms
from .models import Menu, Restaurant


class RestaurantForm(forms.ModelForm):
    class Meta:
        model = Restaurant
        fields = [
            "category",
            "restaurant_image",
            "inside_image1",
            "inside_image2",
            "inside_image3",
            "phone",
            "email",
            "location",
            "address",
            "description",
            "about",
            "opening_time",
            "closing_time",
            "chef_name",
            "chef_image",
            "offers",
            "estimated_delivery_time",
        ]
        labels = {
            "category": "Restaurant Category",
            "restaurant_image": "Restaurant Image",
            "inside_image1": "Inside Image 1",
            "inside_image2": "Inside Image 2",
            "inside_image3": "Inside Image 3",
            "phone": "Phone Number",
            "email": "Email Address",
            "location": "Location",
            "address": "Full Address",
            "description": "Description",
            "about": "About Restaurant",
            "opening_time": "Opening Time",
            "closing_time": "Closing Time",
            "chef_name": "Chef Name",
            "chef_image": "Chef Image",
            "offers": "Current Offers (%)",
            "estimated_delivery_time": "Estimated Delivery Time (minutes)",
        }
        widgets = {
            "category": forms.Select(
                attrs={
                    "class": "w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400",
                }
            ),
            "restaurant_image": forms.ClearableFileInput(
                attrs={
                    "class": "w-full border border-gray-300 p-3 rounded-lg bg-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-red-50 file:text-red-700 hover:file:bg-red-100",
                }
            ),
            "inside_image1": forms.ClearableFileInput(
                attrs={
                    "class": "w-full border border-gray-300 p-3 rounded-lg bg-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-red-50 file:text-red-700 hover:file:bg-red-100",
                }
            ),
            "inside_image2": forms.ClearableFileInput(
                attrs={
                    "class": "w-full border border-gray-300 p-3 rounded-lg bg-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-red-50 file:text-red-700 hover:file:bg-red-100",
                }
            ),
            "inside_image3": forms.ClearableFileInput(
                attrs={
                    "class": "w-full border border-gray-300 p-3 rounded-lg bg-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-red-50 file:text-red-700 hover:file:bg-red-100",
                }
            ),
            "phone": forms.TextInput(
                attrs={
                    "class": "w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400",
                    "placeholder": "+880 1XXX-XXXXXX",
                }
            ),
            "email": forms.EmailInput(
                attrs={
                    "class": "w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400",
                    "placeholder": "restaurant@example.com",
                }
            ),
            "location": forms.TextInput(
                attrs={
                    "class": "w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400",
                    "placeholder": "e.g. Dhanmondi, Dhaka",
                }
            ),
            "address": forms.Textarea(
                attrs={
                    "class": "w-full border border-gray-300 p-3 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-red-400",
                    "rows": 3,
                    "placeholder": "Enter complete address with landmarks",
                }
            ),
            "description": forms.Textarea(
                attrs={
                    "class": "w-full border border-gray-300 p-3 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-red-400",
                    "rows": 4,
                    "placeholder": "Brief description of your restaurant",
                }
            ),
            "about": forms.Textarea(
                attrs={
                    "class": "w-full border border-gray-300 p-3 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-red-400",
                    "rows": 5,
                    "placeholder": "Tell customers about your restaurant's story, specialties, etc.",
                }
            ),
            "opening_time": forms.TimeInput(
                attrs={
                    "class": "w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400",
                    "type": "time",
                }
            ),
            "closing_time": forms.TimeInput(
                attrs={
                    "class": "w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400",
                    "type": "time",
                }
            ),
            "chef_name": forms.TextInput(
                attrs={
                    "class": "w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400",
                    "placeholder": "Chef's name",
                }
            ),
            "chef_image": forms.ClearableFileInput(
                attrs={
                    "class": "w-full border border-gray-300 p-3 rounded-lg bg-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-red-50 file:text-red-700 hover:file:bg-red-100",
                }
            ),
            "offers": forms.NumberInput(
                attrs={
                    "class": "w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400",
                    "placeholder": "e.g. 20 (for 20% off)",
                }
            ),
            "estimated_delivery_time": forms.NumberInput(
                attrs={
                    "class": "w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400",
                    "placeholder": "e.g. 30",
                }
            ),
        }

    def clean_phone(self):
        phone = self.cleaned_data.get("phone")
        if (
            phone
            and not phone.replace("+", "").replace("-", "").replace(" ", "").isdigit()
        ):
            raise forms.ValidationError("Please enter a valid phone number.")
        return phone

    def clean_email(self):
        email = self.cleaned_data.get("email")
        if email and "@" not in email:
            raise forms.ValidationError("Please enter a valid email address.")
        return email

    def clean_estimated_delivery_time(self):
        time = self.cleaned_data.get("estimated_delivery_time")
        if time and (time < 10 or time > 120):
            raise forms.ValidationError(
                "Delivery time should be between 10 and 120 minutes."
            )
        return time

    def clean_offers(self):
        offers = self.cleaned_data.get("offers")
        if offers and (offers < 0 or offers > 100):
            raise forms.ValidationError("Offers should be between 0 and 100 percent.")
        return offers

    def clean(self):
        cleaned_data = super().clean()
        opening_time = cleaned_data.get("opening_time")
        closing_time = cleaned_data.get("closing_time")

        if opening_time and closing_time and opening_time >= closing_time:
            raise forms.ValidationError("Closing time must be after opening time.")

        return cleaned_data


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
