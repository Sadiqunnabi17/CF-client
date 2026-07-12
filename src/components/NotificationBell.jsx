"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell } from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const popupRef = useRef(null);
  const router = useRouter();

  const fetchNotifications = () => {
    axiosInstance.get("/notifications").then((res) => setNotifications(res.data));
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleToggle = async () => {
    const nextOpen = !open;
    setOpen(nextOpen);

    if (nextOpen && unreadCount > 0) {
      // Optimistically clear the badge, then persist to the server
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      try {
        await axiosInstance.patch("/notifications/mark-read");
      } catch {
        // If it fails, refetch to get the real state back
        fetchNotifications();
      }
    }
  };

  const handleClick = (n) => {
    setOpen(false);
    if (n.actionRoute) router.push(n.actionRoute);
  };

  return (
    <div className="relative" ref={popupRef}>
      <button
        type="button"
        onClick={handleToggle}
        className="relative p-2 hover:bg-slate-100 rounded-full"
      >
        <Bell className="w-5 h-5 text-slate-700" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white border rounded-lg shadow-lg z-50">
          {notifications.length === 0 ? (
            <p className="p-4 text-sm text-slate-500">No notifications yet.</p>
          ) : (
            notifications.map((n) => (
              <button
                key={n._id}
                type="button"
                onClick={() => handleClick(n)}
                className="w-full text-left p-3 border-b hover:bg-slate-50 text-sm"
              >
                <p className="text-slate-700">{n.message}</p>
                <p className="text-slate-400 text-xs mt-1">
                  {new Date(n.time).toLocaleString()}
                </p>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}