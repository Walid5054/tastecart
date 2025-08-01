
from django.contrib.auth.base_user import AbstractBaseUser, BaseUserManager
from django.contrib.auth.models import AbstractUser
from django.db import models


# Create your models here.
class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("Users must have an Email")

        user = self.model(email=email, **extra_fields)

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_admin", True)
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser):
    USER_TYPE_CHOICES = (
        ("user", "user"),
        ("owner", "owner"),
        ("rider", "rider"),
    )
    name = models.CharField(max_length=255)
    email = models.CharField(max_length=50, unique=True)
    phone = models.CharField(max_length=15, blank=True, null=True)
    restaurant_name = models.CharField(max_length=255, blank=True, null=True)
    user_type = models.CharField(
        max_length=10, choices=USER_TYPE_CHOICES, default="User"
    )
    city= models.CharField(max_length=100, blank=True, null=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_admin = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    username = None
    groups = None

    USERNAME_FIELD = "email"

    objects = UserManager()

    def __str__(self):
        return str(self.name)

    def has_perm(self, perm, obj=None):
        return self.is_admin

    def has_module_perms(self, app_label):
        return True

    def save(self, *args, **kwargs):
        if self.user_type == "user":
            self.restaurant_name = None
        return super().save(*args, **kwargs)


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    profile_image = models.ImageField(upload_to="profile_images/", blank=True, null=True)
    address = models.CharField(max_length=255, blank=True, null=True)
    bio = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.user.name}'s Profile"

    def save(self, *args, **kwargs):
        if self.user.user_type != "user" and self.user.user_type != "rider":
            raise ValueError("Profiles can only be created for users and riders.")
        super().save(*args, **kwargs)