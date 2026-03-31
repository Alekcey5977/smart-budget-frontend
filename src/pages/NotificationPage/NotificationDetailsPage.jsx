import React, { useEffect, useRef } from "react";
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
import { formatDateTimeRu } from "utils/date";

import {
  useGetNotificationByIdQuery,
  useMarkNotificationAsReadMutation,
  useDeleteNotificationMutation,
} from "services/auth/notificationApi";
import { useGetHistoryByIdQuery } from "services/auth/historyApi";

const DetailsLayout = ({ children, onBack }) => (
  <Box sx={{ p: 2, maxWidth: 800, margin: "0 auto", minHeight: "100vh" }}>
    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
      <Button startIcon={<ArrowBackIcon />} onClick={onBack} color="inherit">
        К списку
      </Button>
    </Box>
    {children}
  </Box>
);

const DetailContent = ({ data }) => (
  <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 }, borderRadius: 2 }}>
    <Box sx={{ mb: 2 }}>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        fontWeight="bold"
        sx={{ fontSize: { xs: "1.5rem", sm: "2rem" } }}
      >
        {data.title || "Уведомление"}
      </Typography>

      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
        <AccessTimeIcon sx={{ fontSize: 16, color: "text.secondary" }} />
        <Typography variant="caption" color="text.secondary">
          {formatDateTimeRu(data.created_at || data.createdAt)}
        </Typography>
      </Box>
    </Box>

    <Typography
      variant="body1"
      sx={{
        whiteSpace: "pre-wrap",
        lineHeight: 1.8,
        fontSize: { xs: "0.9rem", sm: "1rem" },
      }}
    >
      {data.text || data.message || data.body || data.full_text || "Нет текста уведомления"}
    </Typography>

    {data.additional_data && (
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
          {typeof data.additional_data === "object"
            ? JSON.stringify(data.additional_data, null, 2)
            : data.additional_data}
        </Typography>
      </Box>
    )}
  </Paper>
);

const AlertDetails = ({ id, onBack }) => {
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useGetNotificationByIdQuery(id);
  const [markAsRead] = useMarkNotificationAsReadMutation();
  const [deleteNotification] = useDeleteNotificationMutation();
  const markedAsReadRef = useRef(false);

  useEffect(() => {
    if (data && !data.is_read && !markedAsReadRef.current) {
      markedAsReadRef.current = true;
      markAsRead(id).unwrap().catch(console.error);
    }
  }, [data, id, markAsRead]);

  const handleDelete = async () => {
    if (window.confirm("Удалить это уведомление?")) {
      try {
        await deleteNotification(id).unwrap();
        navigate("/notifications", { replace: true, state: { refresh: true } });
      } catch (err) {
        console.error("Error deleting:", err);
        alert("Ошибка при удалении уведомления");
      }
    }
  };

  if (isLoading) return <LoadingIndicator />;
  if (isError || !data) return <ErrorView error={error} onBack={onBack} />;

  return (
    <DetailsLayout onBack={onBack}>
      <DetailContent data={data} />
      <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
        <Button color="error" onClick={handleDelete}>Удалить</Button>
      </Box>
    </DetailsLayout>
  );
};

const HistoryDetails = ({ id, onBack }) => {
  const { data, isLoading, isError, error } = useGetHistoryByIdQuery(id);

  if (isLoading) return <LoadingIndicator />;
  if (isError || !data) return <ErrorView error={error} onBack={onBack} />;

  return (
    <DetailsLayout onBack={onBack}>
      <DetailContent data={data} />
    </DetailsLayout>
  );
};

const LoadingIndicator = () => (
  <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
    <CircularProgress />
  </Box>
);

const ErrorView = ({ error, onBack }) => (
  <Box sx={{ p: 3, textAlign: "center", minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center" }}>
    <Alert severity="error" sx={{ mb: 2 }}>
      {error?.data?.message || "Уведомление не найдено или было удалено"}
    </Alert>
    <Button variant="contained" onClick={onBack} startIcon={<ArrowBackIcon />}>
      Вернуться к списку
    </Button>
  </Box>
);

export default function NotificationDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const notificationType = location.state?.type || "notification";

  const handleBack = () => navigate("/notifications");

  if (notificationType === "history") {
    return <HistoryDetails id={id} onBack={handleBack} />;
  }

  return <AlertDetails id={id} onBack={handleBack} />;
}

