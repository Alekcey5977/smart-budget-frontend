import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { IconButton } from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AuthLayout from "layout/AuthLayout/AuthLayout";
import { useDeleteNotificationMutation } from "services/auth/notificationApi";
import ConfirmDialog from "ui/ConfirmDialog";

function NotificationDeleteButton() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [deleteNotif, { isLoading }] = useDeleteNotificationMutation();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleDeleteConfirm = async () => {
    if (!id) return;

    try {
      await deleteNotif(id).unwrap();
      navigate("/notifications", { replace: true });
    } catch (error) {
      console.error("Ошибка при удалении:", error);
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  return (
    <>
      <IconButton
        aria-label="Удалить"
        onClick={() => setDeleteDialogOpen(true)}
      >
        <DeleteOutlineIcon />
      </IconButton>
      <ConfirmDialog
        open={deleteDialogOpen}
        title="Удалить уведомление?"
        text="Уведомление будет удалено из списка."
        confirmText="Удалить"
        isLoading={isLoading}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
}

export default function NotificationDetailsLayout() {
  return <AuthLayout title="Прогресс цели" />;
}

