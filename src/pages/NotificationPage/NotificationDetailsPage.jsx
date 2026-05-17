import React, { useCallback, useEffect, useState } from "react";
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
import ConfirmDialog from "ui/ConfirmDialog";
import styles from "./NotificationsPage.module.scss";

const DetailsLayout = ({ children }) => (
  <Box className={styles.detailsLayout}>
    <Box className={styles.detailsLayoutInner}>
      {children}
    </Box>
  </Box>
);

const DetailContent = ({ data }) => (
  <Paper
    elevation={0}
    className={styles.detailContentPaper}
    sx={{ bgcolor: "background.paper" }}
  >
    <Typography
      variant="body1"
      color="text.secondary"
      className={styles.detailContentText}
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
  const [deleteNotification, { isLoading: isDeleting }] =
    useDeleteNotificationMutation();
  const { setPageHeaderAction, setPageTitle } = useOutletContext();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleDeleteConfirm = useCallback(async () => {
    try {
      await deleteNotification(id).unwrap();
      navigate("/notifications", { replace: true });
    } catch (err) {
      console.error("Error deleting:", err);
    } finally {
      setDeleteDialogOpen(false);
    }
  }, [id, deleteNotification, navigate]);

  useEffect(() => {
    if (data && setPageHeaderAction) {
      const displayTitle = data.title?.split(":")?.[0]?.trim() || "Уведомление";
      setPageTitle?.(displayTitle === "Прогресс цели" ? "Прогресс цели" : displayTitle);
      setPageHeaderAction(
        <IconButton
          onClick={() => setDeleteDialogOpen(true)}
          sx={{ color: "text.primary" }}
        >
          <DeleteOutlineIcon />
        </IconButton>
      );
    }
    return () => setPageHeaderAction?.(null);
  }, [data, setPageHeaderAction]);

  if (isLoading) return <LoadingIndicator />;
  if (isError || !data) return <ErrorView error={error} />;

  return (
    <>
      <DetailsLayout>
        <DetailContent data={data} />
      </DetailsLayout>
      <ConfirmDialog
        open={deleteDialogOpen}
        title="Удалить уведомление?"
        text="Уведомление будет удалено из списка."
        confirmText="Удалить"
        isLoading={isDeleting}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
};

const HistoryDetails = ({ id }) => {
  const { data, isLoading, isError, error } = useGetHistoryByIdQuery(id);
  const { setPageTitle } = useOutletContext();

  useEffect(() => {
    if (data) {
      const displayTitle = data.title?.split(":")?.[0]?.trim() || "Уведомление";
      setPageTitle?.(displayTitle === "Прогресс цели" ? "Прогресс цели" : displayTitle);
    }
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
  <Box className={styles.loadingView}>
    <CircularProgress />
  </Box>
);

const ErrorView = ({ error }) => {
  const navigate = useNavigate();
  return (
    <Box className={styles.errorView}>
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
