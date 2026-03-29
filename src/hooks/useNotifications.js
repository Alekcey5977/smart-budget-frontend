import { useSelector } from "react-redux";
import { useGetUnreadNotificationsCountQuery } from "services/auth/notificationApi";
import { getAuthToken } from "store/auth/authsSelectors";

export const useNotifications = () => {
  const token = useSelector(getAuthToken);

  const { data, refetch: refetchUnreadCount } = useGetUnreadNotificationsCountQuery(
    undefined,
    {
      pollingInterval: 30000,
      skip: !token,
    },
  );

  const unreadCount =
    typeof data === "object" && data !== null
      ? data.count ?? data.unread_count ?? data.unreadCount ?? 0
      : Number(data) || 0;

  return { unreadCount, refetchUnreadCount };
};
