import { useState, useMemo, useCallback, useEffect } from "react";
import {
  Typography,
  Tabs,
  Tab,
  Paper,
  CircularProgress,
  Box,
  IconButton,
  Alert,
  Snackbar,
} from "@mui/material";
import { useNavigate, useOutletContext } from "react-router-dom";
import DoneAllIcon from "@mui/icons-material/DoneAll";

import {
  useGetNotificationsQuery,
  useMarkAllNotificationsAsReadMutation,
  useDeleteNotificationMutation,
} from "services/auth/notificationApi";
import { useGetHistoryQuery } from "services/auth/historyApi";

import { useNotifications } from "src/hooks/useNotifications";
import styles from "./NotificationsPage.module.scss";

const NotificationsListLayout = ({ items, onNotificationClick, onDelete, emptyMessage, clickable = true }) => {
  if (items.length === 0) {
    return (
      <div className={styles.state}>
        <Typography variant="subtitle1" color="text.secondary">
          {emptyMessage}
        </Typography>
      </div>
    );
  }

  return (
    <>
      {items.map((item) => (
        <Paper
          key={item.id}
          variant="outlined"
          elevation={0}
          className={styles.notificationCard}
          onClick={clickable ? () => onNotificationClick(item) : undefined}
          sx={{
            mb: 2,
            p: 2,
            borderRadius: "16px",
            position: "relative",
            cursor: clickable ? "pointer" : "default",
            bgcolor: "background.paper",
            border: "1px solid",
            borderColor: "divider",
            transition: clickable ? "all 0.2s" : "none",
            "&:hover": clickable ? {
              bgcolor: "background.paper",
            } : {},
          }}
        >
          {item.is_read === false && (
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
              variant="body1"
              fontWeight={700}
              color="text.primary"
              sx={{ flexGrow: 1, pr: 1, fontSize: "16px" }}
            >
              {item.title}
            </Typography>
            {Boolean(onDelete) && (
              <IconButton
                size="small"
                onClick={(e) => onDelete(item.id, e)}
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
      ))}
    </>
  );
};

export const HistoryList = () => {
  const { data: history = [], isLoading } = useGetHistoryQuery(undefined, {
    pollingInterval: 2000,
  });

  const items = useMemo(() => {
    const mapped = history.map((item) => ({
      id: item.id,
      title: item.title || "Уведомление",
      message: item.body || item.message || "Действие в системе",
      created_at: item.created_at,
      category: "history",
    }));

    return mapped.filter((item) => item.title !== "Синхронизация завершена");
  }, [history]);

  if (isLoading) return <LoadingIndicator />;

  return (
    <NotificationsListLayout
      items={items}
      emptyMessage="История пуста"
      clickable={false}
    />
  );
};

const AlertsList = ({ onNotificationClick, showSnackbar }) => {
  const { data: notifications = [], isLoading } = useGetNotificationsQuery(undefined, {
    pollingInterval: 2000,
  });
  const [deleteNotification] = useDeleteNotificationMutation();

  const items = useMemo(() => {
    return notifications
      .map((item) => ({
        id: item.id,
        title: item.title || "Уведомление",
        message: item.message || item.body || item.text || "Новое уведомление",
        created_at: item.created_at,
        is_read: item.is_read || false,
        category: "notification",
      }))
      .filter((item) => item.title !== "Синхронизация завершена");
  }, [notifications]);

  const handleDelete = useCallback(
    async (id, event) => {
      event.stopPropagation();
      if (window.confirm("Удалить это уведомление?")) {
        try {
          await deleteNotification(id).unwrap();
          showSnackbar("Уведомление удалено");
        } catch (error) {
          console.error("Error deleting:", error);
          showSnackbar("Ошибка при удалении");
        }
      }
    },
    [deleteNotification, showSnackbar],
  );

  if (isLoading) return <LoadingIndicator />;

  return (
    <NotificationsListLayout
      items={items}
      onNotificationClick={onNotificationClick}
      onDelete={handleDelete}
      emptyMessage="Уведомлений пока нет"
    />
  );
};

const LoadingIndicator = () => (
  <Box display="flex" justifyContent="center" mt={10}>
    <CircularProgress />
  </Box>
);

export default function NotificationsPage() {
  const navigate = useNavigate();
  const { setPageHeaderAction } = useOutletContext();
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const { unreadCount } = useNotifications();

  const [markAllAsRead] = useMarkAllNotificationsAsReadMutation();

  const handleNotificationClick = useCallback(
    (item) => {
      if (item.id) {
        navigate(`/notifications/${item.id}`, {
          state: {
            type: item.category,
          },
        });
      }
    },
    [navigate],
  );

  const showSnackbar = useCallback((message) => {
    setSnackbar({ open: true, message });
  }, []);

  const handleMarkAllRead = useCallback(async () => {
    if (unreadCount === 0) return;

    try {
      await markAllAsRead().unwrap();
      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 3000);
    } catch (err) {
      console.error("Error marking all as read:", err);
    }
  }, [markAllAsRead, unreadCount]);

  useEffect(() => {
    if (setPageHeaderAction) {
      setPageHeaderAction(
        <IconButton onClick={handleMarkAllRead} sx={{ color: "text.primary" }}>
          <DoneAllIcon />
        </IconButton>,
      );
    }
    return () => setPageHeaderAction?.(null);
  }, [setPageHeaderAction, handleMarkAllRead]);

  return (
    <div className={styles.page}>
      {showSuccessAlert && (
        <Alert
          severity="success"
          onClose={() => setShowSuccessAlert(false)}
          sx={{ mb: 2, borderRadius: "12px" }}
        >
          Все уведомления прочитаны
        </Alert>
      )}

      <AlertsList
        onNotificationClick={handleNotificationClick}
        showSnackbar={showSnackbar}
      />
    </div>
  );
}

