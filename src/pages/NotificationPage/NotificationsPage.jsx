import { useState, useMemo, useCallback } from "react";
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
import { useNavigate } from "react-router-dom";

import {
  useGetNotificationsQuery,
  useMarkAllNotificationsAsReadMutation,
  useDeleteNotificationMutation,
} from "services/auth/notificationApi";
import { useGetHistoryQuery } from "services/auth/historyApi";

import styles from "./NotificationsPage.module.scss";

const NotificationsListLayout = ({ items, onNotificationClick, onDelete, emptyMessage }) => {
  if (items.length === 0) {
    return (
      <Typography textAlign="center" color="text.secondary" mt={4}>
        {emptyMessage}
      </Typography>
    );
  }

  return (
    <>
      {items.map((item) => (
        <Paper
          key={item.id}
          variant="outlined"
          className={styles.notificationCard}
          onClick={() => onNotificationClick(item)}
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
              variant="subtitle1"
              fontWeight={700}
              color="text.primary"
              sx={{ flexGrow: 1, pr: 1 }}
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

const HistoryList = ({ onNotificationClick }) => {
  const { data: history = [], isLoading } = useGetHistoryQuery();

  const items = useMemo(() => {
    return history.map((item) => ({
      id: item.id,
      title: item.title || "Системное уведомление",
      message: item.body || item.message || "Действие в системе",
      created_at: item.created_at,
      category: "history",
    }));
  }, [history]);

  if (isLoading) return <LoadingIndicator />;

  return (
    <NotificationsListLayout
      items={items}
      onNotificationClick={onNotificationClick}
      emptyMessage="Системных уведомлений пока нет"
    />
  );
};

const AlertsList = ({ onNotificationClick, showSnackbar }) => {
  const { data: notifications = [], isLoading } = useGetNotificationsQuery();
  const [deleteNotification] = useDeleteNotificationMutation();

  const items = useMemo(() => {
    return notifications.map((item) => ({
      id: item.id,
      title: item.title || "Оповещение",
      message: item.message || item.body || item.text || "Новое уведомление",
      created_at: item.created_at,
      is_read: item.is_read || false,
      category: "notification",
    }));
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
      emptyMessage="Оповещательных уведомлений пока нет"
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
  const [tabIndex, setTabIndex] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });

  const handleNotificationClick = useCallback(
    (item) => {
      if (item.id) {
        navigate(`/notifications/${item.id}`, {
          state: {
            type: item.category,
            notification: item,
          },
        });
      }
    },
    [navigate],
  );

  const showSnackbar = useCallback((message) => {
    setSnackbar({ open: true, message });
  }, []);

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

      {tabIndex === 0 ? (
        <HistoryList onNotificationClick={handleNotificationClick} />
      ) : (
        <AlertsList
          onNotificationClick={handleNotificationClick}
          showSnackbar={showSnackbar}
        />
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity="success"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}

