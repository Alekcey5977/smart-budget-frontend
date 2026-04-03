import React from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { IconButton } from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AuthLayout from "layout/AuthLayout/AuthLayout";
import { useDeleteNotificationMutation } from "services/auth/notificationApi";

function NotificationDeleteButton() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [deleteNotif] = useDeleteNotificationMutation();

  const handleDelete = async () => {
    if (!id) return;

    if (window.confirm("Удалить это уведомление?")) {
      try {
        await deleteNotif(id).unwrap();
        navigate("/notifications", { replace: true });
      } catch (error) {
        console.error("Ошибка при удалении:", error);
      }
    }
  };

  return (
    <IconButton aria-label="Удалить" onClick={handleDelete}>
      <DeleteOutlineIcon />
    </IconButton>
  );
}

export default function NotificationDetailsLayout() {
  return (
    <AuthLayout
      title="Уведомление"
      headerRightContent={<NotificationDeleteButton />}
    />
  );
}
