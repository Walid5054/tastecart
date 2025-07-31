document.addEventListener("DOMContentLoaded", () => {
  const notificationBell = document.getElementById("notificationBell");
  const notificationDropdown = document.getElementById("notificationDropdown");
  const notificationCount = document.getElementById("notificationCount");
  const notificationList = document.getElementById("notificationList");
  const markAllReadBtn = document.getElementById("markAllRead");
  const mobileNotifications = document.getElementById("mobileNotifications");

  function toggleNotificationDropdown() {
    if (!notificationDropdown) return;

    const isHidden = notificationDropdown.classList.contains("hidden");
    if (isHidden) {
      showNotificationDropdown();
      markNotificationsAsRead();
    } else {
      hideNotificationDropdown();
    }
  }

  function showNotificationDropdown() {
    notificationDropdown.classList.remove("hidden");
    notificationDropdown.classList.add("visible");
  }

  function hideNotificationDropdown() {
    notificationDropdown.classList.add("hidden");
    notificationDropdown.classList.remove("visible");
  }

  async function markNotificationsAsRead() {
    try {
      const response = await fetch("/mark-notifications-read/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCookie("csrftoken"),
        },
      });
      const data = await response.json();
      if (data.success) updateUIAfterMarkingRead();
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  }

  function updateUIAfterMarkingRead() {
    if (notificationCount) notificationCount.style.display = "none";

    const mobileNotifBadge = document.querySelector(
      "#mobileNotifications .bg-red-500"
    );
    if (mobileNotifBadge) mobileNotifBadge.style.display = "none";

    const unreadNotifs = document.querySelectorAll(
      "#notificationList .bg-red-50"
    );
    unreadNotifs.forEach((notif) => notif.classList.remove("bg-red-50"));

    if (markAllReadBtn?.parentElement)
      markAllReadBtn.parentElement.style.display = "none";
  }

  

  function handleMobileNotifications(e) {
    e.preventDefault();
    window.location.href = "/notifications/";
  }

  function timeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
    };

    for (const unit in intervals) {
      const interval = Math.floor(seconds / intervals[unit]);
      if (interval >= 1) {
        return `${interval} ${unit}${interval > 1 ? "s" : ""} ago`;
      }
    }
    return "Just now";
  }

  function getCookie(name) {
    const cookies = document.cookie.split(";").map((c) => c.trim());
    for (const cookie of cookies) {
      if (cookie.startsWith(name + "=")) {
        return decodeURIComponent(cookie.slice(name.length + 1));
      }
    }
    return null;
  }

  // Bind events
  if (notificationBell) {
    notificationBell.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleNotificationDropdown();
    });
  }

  if (markAllReadBtn) {
    markAllReadBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      markNotificationsAsRead();
    });
  }

  if (mobileNotifications) {
    mobileNotifications.addEventListener("click", handleMobileNotifications);
  }

  document.addEventListener("click", (e) => {
    if (
      !notificationBell?.contains(e.target) &&
      !notificationDropdown?.contains(e.target) &&
      !notificationDropdown?.classList.contains("hidden")
    ) {
      hideNotificationDropdown();
    }
  });

  // Auto-refresh
  setInterval(refreshNotifications, 30000);
});
