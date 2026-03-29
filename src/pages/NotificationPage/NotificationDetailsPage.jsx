import React, { useEffect, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  CircularProgress,
  Button,
  Paper,
  Alert,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import InfoIcon from "@mui/icons-material/Info";

import {
  useGetNotificationByIdQuery,
  useGetHistoryByIdQuery,
  useMarkNotificationAsReadMutation,
  useDeleteNotificationMutation,
} from "services/auth/notificationApi";

export default function NotificationDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const notificationType = location.state?.type || "notification";
  const isHistory = notificationType === "history";

  console.log("Notification ID:", id);
  console.log("Notification type:", notificationType);
  console.log("Is history:", isHistory);

  const {
    data: notificationData,
    isLoading: notificationLoading,
    isError: notificationError,
    error: notificationErrorData,
  } = useGetNotificationByIdQuery(id, {
    skip: isHistory || !id,
  });

  const {
    data: historyData,
    isLoading: historyLoading,
    isError: historyError,
    error: historyErrorData,
  } = useGetHistoryByIdQuery(id, {
    skip: !isHistory || !id,
  });

  const [markAsRead] = useMarkNotificationAsReadMutation();
  const [deleteNotification] = useDeleteNotificationMutation();

  const notification = useMemo(() => {
    if (isHistory) {
      return historyData;
    }
    return notificationData;
  }, [isHistory, historyData, notificationData]);

  const isLoading = isHistory ? historyLoading : notificationLoading;
  const isError = isHistory ? historyError : notificationError;
  const error = isHistory ? historyErrorData : notificationErrorData;
  const handleDelete = async () => {
    if (!id || isHistory) return;

    if (window.confirm("Удалить это уведомление?")) {
      try {
        await deleteNotification(id).unwrap();
        navigate("/notifications", {
          replace: true,
          state: { refresh: true },
        });
      } catch (error) {
        console.error("Error deleting:", error);
        alert("Ошибка при удалении уведомления");
      }
    }
  };

  const handleBack = () => {
    navigate("/notifications");
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (isError || !notification) {
    return (
      <Box
        sx={{
          p: 3,
          textAlign: "center",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Alert severity="error" sx={{ mb: 2 }}>
          {error?.data?.message || "Уведомление не найдено или было удалено"}
        </Alert>
        <Button
          variant="contained"
          onClick={handleBack}
          startIcon={<ArrowBackIcon />}
        >
          Вернуться к списку
        </Button>
      </Box>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Box sx={{ p: 2, maxWidth: 800, margin: "0 auto", minHeight: "100vh" }}>
      {/* Шапка с кнопками */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          color="inherit"
        >
          К списку
        </Button>
      </Box>

      {/* Карточка уведомления */}
      <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 }, borderRadius: 2 }}>
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            fontWeight="bold"
            sx={{ fontSize: { xs: "1.5rem", sm: "2rem" } }}
          >
            {notification.title || "Уведомление"}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
            <AccessTimeIcon sx={{ fontSize: 16, color: "text.secondary" }} />
            <Typography variant="caption" color="text.secondary">
              {formatDate(notification.created_at || notification.createdAt)}
            </Typography>
          </Box>
        </Box>

        {/* Текст уведомления */}
        <Typography
          variant="body1"
          sx={{
            whiteSpace: "pre-wrap",
            lineHeight: 1.8,
            fontSize: { xs: "0.9rem", sm: "1rem" },
          }}
        >
          {notification.text ||
            notification.message ||
            notification.body ||
            notification.full_text ||
            "Нет текста уведомления"}
        </Typography>

        {/* Дополнительная информация */}
        {notification.additional_data && (
          <Box sx={{ mt: 3, p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <InfoIcon sx={{ fontSize: 16, color: "text.secondary" }} />
              <Typography variant="subtitle2" color="text.secondary">
                Дополнительная информация
              </Typography>
            </Box>
            <Typography
              variant="body2"
              color="text.secondary"
              component="pre"
              sx={{ whiteSpace: "pre-wrap" }}
            >
              {typeof notification.additional_data === "object"
                ? JSON.stringify(notification.additional_data, null, 2)
                : notification.additional_data}
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
}
