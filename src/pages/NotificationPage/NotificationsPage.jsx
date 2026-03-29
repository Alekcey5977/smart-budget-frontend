import { useState, useMemo, useCallback } from "react";
import {
  Typography,
  Tabs,
  Tab,
  Paper,
  CircularProgress,
  Box,
  Button,
  IconButton,
  Alert,
  Snackbar,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import {
  useGetNotificationsQuery,
  useMarkAllNotificationsAsReadMutation,
  useDeleteNotificationMutation,
} from "services/auth/notificationApi";
import { useGetHistoryQuery } from "services/auth/historyApi";

import styles from "./NotificationsPage.module.scss";

export default function NotificationsPage() {
  const navigate = useNavigate();
  const [tabIndex, setTabIndex] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });

  const {
    data: history = [],
    isLoading: hLoading,
    refetch: refetchHistory,
  } = useGetHistoryQuery();

  const {
    data: notifications = [],
    isLoading: nLoading,
    refetch: refetchNotifications,
  } = useGetNotificationsQuery();

  const [markAllNotificationsAsRead] = useMarkAllNotificationsAsReadMutation();
  const [deleteNotification] = useDeleteNotificationMutation();

  const isLoading = hLoading || nLoading;

  const systemNotifications = useMemo(() => {
    return [...history]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .map((item) => ({
        id: item.id,
        title: item.title || "Системное уведомление",
        message: item.body || item.message || "Действие в системе",
        created_at: item.created_at,
        is_read: true,
        type: "SYSTEM",
        category: "history",
      }));
  }, [history]);

  const alertNotifications = useMemo(() => {
    return [...notifications]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .map((item) => ({
        id: item.id,
        title: item.title || "Оповещение",
        message: item.message || item.body || item.text || "Новое уведомление",
        created_at: item.created_at,
        is_read: item.is_read || false,
        type: item.type || "ALERT",
        category: "notification",
      }));
  }, [notifications]);

  const filteredItems = useMemo(() => {
    if (tabIndex === 0) {
      return systemNotifications;
    }
    if (tabIndex === 1) {
      return alertNotifications;
    }
    return [];
  }, [tabIndex, systemNotifications, alertNotifications]);

  const hasUnreadAlerts = useMemo(
    () => alertNotifications.some((n) => !n.is_read),
    [alertNotifications],
  );

  const handleDelete = useCallback(
    async (id, event) => {
      event.stopPropagation();
      if (window.confirm("Удалить это уведомление?")) {
        try {
          await deleteNotification(id).unwrap();
          setSnackbar({ open: true, message: "Уведомление удалено" });
          refetchNotifications();
        } catch (error) {
          console.error("Error deleting:", error);
          setSnackbar({ open: true, message: "Ошибка при удалении" });
        }
      }
    },
    [deleteNotification, refetchNotifications],
  );

  const handleNotificationClick = useCallback(
    (item) => {
      if (item.id) {
        const url = `/notifications/${item.id}`;
        navigate(url, {
          state: {
            type: item.category,
            notification: item,
          },
        });
      }
    },
    [navigate],
  );

  const handleMarkAllRead = async () => {
    if (window.confirm("Отметить все уведомления как прочитанные?")) {
      try {
        await markAllNotificationsAsRead().unwrap();
        setSnackbar({
          open: true,
          message: "Все уведомления отмечены как прочитанные",
        });
        refetchNotifications();
      } catch (error) {
        console.error("Error marking all as read:", error);
        setSnackbar({ open: true, message: "Ошибка при отметке" });
      }
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ open: false, message: "" });
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div className={styles.page}>
      <Tabs
        value={tabIndex}
        onChange={(e, idx) => setTabIndex(idx)}
        centered
        sx={{
          mb: 2,
          "& .MuiTab-root": {
            fontSize: "12px",
            minWidth: "auto",
            padding: "8px 12px",
            textTransform: "none",
          },
        }}
      >
        <Tab label="Системные" />
        <Tab label="Оповещательные" />
      </Tabs>

      {filteredItems.length === 0 ? (
        <Typography textAlign="center" color="text.secondary" mt={4}>
          {tabIndex === 0
            ? "Системных уведомлений пока нет"
            : "Оповещательных уведомлений пока нет"}
        </Typography>
      ) : (
        filteredItems.map((item) => (
          <Paper
            key={item.id}
            variant="outlined"
            className={styles.notificationCard}
            onClick={() => handleNotificationClick(item)}
            sx={{
              mb: 2,
              p: 2,
              borderRadius: "16px",
              position: "relative",
              cursor: "pointer",
              bgcolor: "background.paper",
              border: "1px solid",
              borderColor: "divider",
              transition: "all 0.2s",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              },
            }}
          >
            {item.category === "notification" && !item.is_read && (
              <Box
                sx={{
                  position: "absolute",
                  top: "16px",
                  left: "8px",
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  bgcolor: "error.main",
                }}
              />
            )}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <Typography
                variant="subtitle1"
                fontWeight={700}
                color="text.primary"
                sx={{ flexGrow: 1, pr: 1 }}
              >
                {item.title}
              </Typography>
              {item.category === "notification" && (
                <IconButton
                  size="small"
                  onClick={(e) => handleDelete(item.id, e)}
                  sx={{ p: 0.5, mt: -0.5, mr: -0.5 }}
                ></IconButton>
              )}
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {item.message}
            </Typography>

            <Typography
              variant="caption"
              color="text.disabled"
              display="block"
              sx={{ mt: 2 }}
            >
              {item.created_at
                ? new Date(item.created_at).toLocaleString("ru-RU", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : ""}
            </Typography>
          </Paper>
        ))
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}
