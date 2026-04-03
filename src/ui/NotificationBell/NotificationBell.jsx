import React from "react";
import { IconButton, Badge } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useNavigate } from "react-router-dom";
import { useGetUnreadCountQuery } from "services/auth/notificationApi";

export default function NotificationBell() {
  const navigate = useNavigate();
  const { data: unreadCount = 0, refetch } = useGetUnreadCountQuery();

  React.useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 30000);

    return () => clearInterval(interval);
  }, [refetch]);

  const handleClick = () => {
    navigate("/notifications");
  };

  return (
    <IconButton onClick={handleClick} color="inherit" size="large">
      <Badge
        badgeContent={unreadCount}
        color="error"
        variant={unreadCount > 0 ? "dot" : "standard"}
        overlap="circular"
        sx={{
          "& .MuiBadge-badge": {
            backgroundColor: "#fcc036",
            color: "white",
          },
        }}
      >
        <NotificationsIcon />
      </Badge>
    </IconButton>
  );
}
