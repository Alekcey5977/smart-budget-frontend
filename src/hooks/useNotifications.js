import { useMemo } from "react";
import { useSelector } from "react-redux";
import { useGetNotificationsQuery } from "services/auth/notificationApi";
import { getAuthToken } from "store/auth/authsSelectors";

export const useNotifications = () => {
  const token = useSelector(getAuthToken);

  const { data: notifications = [], refetch } = useGetNotificationsQuery(
    undefined,
    {
      pollingInterval: 2000,
      skip: !token,
    },
  );

  const unreadCount = useMemo(() => {
    if (!Array.isArray(notifications)) return 0;
    return notifications.filter(
      (n) => !n.is_read && n.title !== "Синхронизация завершена",
    ).length;
  }, [notifications]);

  return { unreadCount, refetchUnreadCount: refetch };
};
