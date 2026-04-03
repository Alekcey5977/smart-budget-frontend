import React from 'react';
import { IconButton } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import AuthLayout from "layout/AuthLayout/AuthLayout";
import { useMarkAllNotificationsAsReadMutation } from "services/auth/notificationApi";

function MarkAllReadButton() {
  const [markAll] = useMarkAllNotificationsAsReadMutation();

  return (
    <IconButton aria-label="Прочитать все" onClick={() => markAll()}>
      <CheckIcon />
    </IconButton>
  );
}

export default function NotificationsLayout() {
  return (
    <AuthLayout
      title="Уведомления"
      headerRightContent={<MarkAllReadButton />}
    />
  );
}
