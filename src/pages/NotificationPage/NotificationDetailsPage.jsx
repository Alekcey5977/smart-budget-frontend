import React, { useCallback, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  CircularProgress,
  Button,
  Paper,
  Alert,
  IconButton,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import InfoIcon from "@mui/icons-material/Info";
import { useOutletContext } from "react-router-dom";

import {
  useGetNotificationByIdQuery,
  useDeleteNotificationMutation,
} from "services/auth/notificationApi";
import { useGetHistoryByIdQuery } from "services/auth/historyApi";

const DetailsLayout = ({ children }) => (
  <Box sx={{
    width: "100%",
    padding: "0 16px",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  }}>
    <Box sx={{ width: "100%", maxWidth: 500 }}>
      {children}
    </Box>
  </Box>
);

const DetailContent = ({ data }) => (
  <Paper
    elevation={0}
    sx={{
      p: 2,
      borderRadius: "16px",
      width: "100%",
      boxSizing: "border-box",
      bgcolor: "background.paper",
      border: "none",
    }}
  >
    <Typography
      variant="body1"
      color="text.secondary"
      sx={{
        whiteSpace: "pre-wrap",
        lineHeight: 1.6,
        textAlign: "left",
        width: "100%",
        fontSize: "20px"
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

const AlertDetails = ({ id }) => {
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useGetNotificationByIdQuery(id);
  const [deleteNotification] = useDeleteNotificationMutation();
  const { setPageHeaderAction, setPageTitle } = useOutletContext();

  const handleDelete = useCallback(async () => {
    if (window.confirm("Удалить это уведомление?")) {
      try {
        await deleteNotification(id).unwrap();
        navigate("/notifications", { replace: true });
      } catch (err) {
        console.error("Error deleting:", err);
      }
    }
  }, [id, deleteNotification, navigate]);

  useEffect(() => {
    if (data && setPageHeaderAction) {
      setPageTitle?.(data.title?.split(":")?.[0]?.trim() || "Прогресс цели");
      setPageHeaderAction(
        <IconButton onClick={handleDelete} sx={{ color: "text.primary" }}>
          <DeleteOutlineIcon />
        </IconButton>
      );
    }
    return () => {
      setPageHeaderAction?.(null);
      setPageTitle?.(null);
    };
  }, [data, setPageHeaderAction, setPageTitle, handleDelete]);

  if (isLoading) return <LoadingIndicator />;
  if (isError || !data) return <ErrorView error={error} />;

  return (
    <DetailsLayout>
      <DetailContent data={data} />
    </DetailsLayout>
  );
};

const HistoryDetails = ({ id }) => {
  const { data, isLoading, isError, error } = useGetHistoryByIdQuery(id);
  const { setPageTitle } = useOutletContext();

  useEffect(() => {
    if (data) setPageTitle?.(data.title?.split(":")?.[0]?.trim() || "Прогресс цели");
    return () => setPageTitle?.(null);
  }, [data, setPageTitle]);

  if (isLoading) return <LoadingIndicator />;
  if (isError || !data) return <ErrorView error={error} />;

  return (
    <DetailsLayout>
      <DetailContent data={data} />
    </DetailsLayout>
  );
};

const LoadingIndicator = () => (
  <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
    <CircularProgress />
  </Box>
);

const ErrorView = ({ error }) => {
  const navigate = useNavigate();
  return (
    <Box sx={{ p: 3, textAlign: "center", minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center" }}>
      <Alert severity="error" sx={{ mb: 2 }}>
        {error?.data?.message || "Уведомление не найдено или было удалено"}
      </Alert>
      <Button variant="contained" onClick={() => navigate("/notifications")}>
        Вернуться к списку
      </Button>
    </Box>
  );
};

export default function NotificationDetailsPage() {
  const { id } = useParams();
  const location = useLocation();
  const notificationType = location.state?.type || "notification";

  if (notificationType === "history") {
    return <HistoryDetails id={id} />;
  }

  return <AlertDetails id={id} />;
}

