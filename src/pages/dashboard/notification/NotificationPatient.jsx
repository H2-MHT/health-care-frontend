import React from 'react';
import './notification.css';
import { useTranslation } from "react-i18next";

const NotificationDropdown = ({ notifications, onMarkAsRead,onDeleteNotification }) => {
  const{t} = useTranslation();
  const handleNotificationClick = (id) => {
    onMarkAsRead(id);
  };
  const handleDeleteClick = (id, e) => {
    e.stopPropagation(); 
    onDeleteNotification(id); 
  };
  return (
    <div className="notificationBox">
      <h5>{t("wallet.all-notifications")}</h5>
      <div className="notificationInner">
        <table>
          <thead>
            <tr>
              <th>{t("wallet.name")}</th>
              <th>{t("wallet.date")}</th>
              <th>{t("wallet.delete")}</th>
            </tr>
          </thead>
          <tbody>
            {notifications.map((notification) => (
              <tr
                key={notification.id}
                onClick={() => handleNotificationClick(notification.id)}
                style={{ cursor: "pointer" }}
                className={
                  notification.is_read
                    ? "notification-read"
                    : "notification-unread"
                }
              >
                <td>{notification.message}</td>
                <td>{notification.created_at}</td>
                <td>
                  <img
                    src="/images/clinic-dashboard/delete.png"
                    alt="Pin"
                    onClick={(e) => handleDeleteClick(notification.id, e)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NotificationDropdown;
