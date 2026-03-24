import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  useGetNotificationsQuery,
  useGetUnreadNotificationsCountQuery,
  useMarkNotificationAsReadMutation,
  useDeleteNotificationMutation,
} from "services/auth/notificationApi";

export const useNotifications = () => {
  const navigate = useNavigate();

  const {
    data: notifications = [],
    isLoading: notificationsLoading,
    refetch: refetchNotifications,
  } = useGetNotificationsQuery();

  const {
    data: unreadCount = 0,
    isLoading: countLoading,
    refetch: refetchCount,
  } = useGetUnreadNotificationsCountQuery();

  const [markAsRead] = useMarkNotificationAsReadMutation();
  const [deleteNotification] = useDeleteNotificationMutation();

  const handleNotificationClick = useCallback(
    (notificationId) => {
      navigate(`/notifications/${notificationId}`);
    },
    [navigate],
  );

  const handleMarkAsRead = useCallback(
    async (notificationId) => {
      try {
        await markAsRead(notificationId).unwrap();
        refetchNotifications();
        refetchCount();
      } catch (error) {
        console.error("Error marking notification as read:", error);
      }
    },
    [markAsRead, refetchNotifications, refetchCount],
  );

  const handleDelete = useCallback(
    async (notificationId) => {
      try {
        await deleteNotification(notificationId).unwrap();
        refetchNotifications();
        refetchCount();
        return true;
      } catch (error) {
        console.error("Error deleting notification:", error);
        return false;
      }
    },
    [deleteNotification, refetchNotifications, refetchCount],
  );

  return {
    notifications,
    unreadCount,
    isLoading: notificationsLoading || countLoading,
    handleNotificationClick,
    handleMarkAsRead,
    handleDelete,
    refetchNotifications,
    refetchCount,
  };
};
