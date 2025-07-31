from .models import notification


def notification_count(request):
    notification_count = 0
    all_notifications = []

    if request.user.is_authenticated:
        # Get unread notifications for the authenticated user
        all_notifications = notification.objects.filter(
            user=request.user
        ).order_by("-created_at")
        notification_count = all_notifications.filter(is_read=False).count()

    return {
        "notification_count": notification_count,
        "all_notifications": all_notifications,
    }
