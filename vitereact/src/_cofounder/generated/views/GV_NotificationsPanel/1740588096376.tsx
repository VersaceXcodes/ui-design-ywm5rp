import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/main";
import { set_notifications } from "@/store/main";
import axios from "axios";
import { IoClose, IoCheckmarkDone, IoNotificationsOutline } from "react-icons/io5";

const GV_NotificationsPanel: React.FC = () => {
  const dispatch = useDispatch();
  const notifications = useSelector((state: RootState) => state.notifications);
  const [filter, setFilter] = useState<"All" | "Mentions" | "Project Updates">("All");
  const [isOpen, setIsOpen] = useState(false);

  const markNotificationAsRead = async (id: string) => {
    try {
      await axios.patch(`http://localhost:1337/api/notifications/${id}/read`);
      const updatedNotifications = notifications.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      );
      dispatch(set_notifications(updatedNotifications));
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await axios.delete(`http://localhost:1337/api/notifications/${id}`);
      const updatedNotifications = notifications.filter((notif) => notif.id !== id);
      dispatch(set_notifications(updatedNotifications));
    } catch (err) {
      console.error("Error deleting notification:", err);
    }
  };

  const filteredNotifications = notifications.filter((notif) => {
    if (filter === "All") return true;
    if (filter === "Mentions") return notif.type === "mention";
    if (filter === "Project Updates") return notif.type === "project_update";
    return false;
  });

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        <IoNotificationsOutline size={24} />
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
            {notifications.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-900 rounded-lg shadow-xl border dark:border-gray-700">
          <div className="border-b dark:border-gray-700 p-3 flex justify-between items-center">
            <h3 className="text-lg font-semibold">Notifications</h3>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as "All" | "Mentions" | "Project Updates")}
              className="text-sm border rounded p-1 focus:ring-2 focus:ring-indigo-500"
            >
              <option value="All">All</option>
              <option value="Mentions">Mentions</option>
              <option value="Project Updates">Project Updates</option>
            </select>
          </div>

          <ul className="max-h-80 overflow-y-auto">
            {filteredNotifications.length === 0 ? (
              <li className="p-4 text-center text-gray-500 dark:text-gray-400">No notifications.</li>
            ) : (
              filteredNotifications.map((notif) => (
                <li
                  key={notif.id}
                  className="flex items-center justify-between p-3 border-b dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                >
                  <div className="flex-1 text-sm">
                    <p className="font-medium">{notif.message}</p>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => markNotificationAsRead(notif.id)}
                      className="text-green-500 hover:text-green-700"
                    >
                      <IoCheckmarkDone size={18} />
                    </button>
                    <button
                      onClick={() => deleteNotification(notif.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <IoClose size={18} />
                    </button>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </>
  );
};

export default GV_NotificationsPanel;