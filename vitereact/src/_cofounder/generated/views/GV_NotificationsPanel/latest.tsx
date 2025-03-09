import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/main";
import { set_notifications } from "@/store/main";
import axios from "axios";
import { Link } from "react-router-dom";

const GV_NotificationsPanel: React.FC = () => {
  const dispatch = useDispatch();
  const notifications = useSelector((state: RootState) => state.notifications);
  const [filter, setFilter] = useState<"All" | "Mentions" | "Project Updates">("All");

  const filteredNotifications = notifications.filter((notif) => {
    if (filter === "All") return true;
    if (filter === "Mentions") return notif.type === "mention";
    if (filter === "Project Updates") return notif.type === "project_update";
    return false;
  });

  const markNotificationAsRead = async (id: string) => {
    try {
      await axios.patch(`http://localhost:1337/api/notifications/${id}/read`);
      dispatch(set_notifications(notifications.filter((n) => n.id !== id)));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await axios.delete(`http://localhost:1337/api/notifications/${id}`);
      dispatch(set_notifications(notifications.filter((n) => n.id !== id)));
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  return (
    <>
      <div className="absolute top-14 right-4 w-96 bg-white shadow-lg rounded-lg p-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold">Notifications</h2>
          <select
            className="border rounded p-1 text-sm"
            value={filter}
            onChange={(e) => setFilter(e.target.value as "All" | "Mentions" | "Project Updates")}
          >
            <option value="All">All</option>
            <option value="Mentions">Mentions</option>
            <option value="Project Updates">Project Updates</option>
          </select>
        </div>

        <div className="space-y-2">
          {filteredNotifications.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-3">No notifications</p>
          ) : (
            filteredNotifications.map((notif) => (
              <div
                key={notif.id}
                className="border p-2 rounded flex justify-between items-start hover:bg-gray-100 transition"
              >
                <div className="flex-1">
                  <p className={`text-sm ${notif.type === "mention" ? "font-bold" : ""}`}>
                    {notif.message}
                  </p>
                  {notif.type === "project_update" && (
                    <Link to="/dashboard" className="text-blue-500 text-xs underline">
                      View Dashboard
                    </Link>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => markNotificationAsRead(notif.id)}
                    className="text-xs text-green-600 hover:text-green-800"
                  >
                    Mark as Read
                  </button>
                  <button
                    onClick={() => deleteNotification(notif.id)}
                    className="text-xs text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default GV_NotificationsPanel;