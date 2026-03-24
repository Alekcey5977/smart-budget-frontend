import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Alert,
  Typography,
  Box,
} from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";

export default function DeleteAccountDialog({
  open,
  account,
  onClose,
  onConfirm,
  isLoading,
}) {
  if (!account) return null;

  const hasBalance = account.balance > 0;
  const formattedBalance = new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: account.currency || "RUB",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(account.balance || 0);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="delete-dialog-title"
      PaperProps={{
        sx: {
          borderRadius: "20px",
          maxWidth: "90%",
          width: "320px",
          margin: "16px",
        },
      }}
    >
      <DialogTitle
        id="delete-dialog-title"
        sx={{
          pb: 1,
          color: "error.main",
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <WarningIcon />
        Удалить счет?
      </DialogTitle>

      <DialogContent>
        <DialogContentText component="div">
          <Typography variant="body1" gutterBottom>
            Вы уверены, что хотите удалить счет:
          </Typography>

          <Box
            sx={{
              bgcolor: "grey.50",
              p: 2,
              borderRadius: "12px",
              my: 2,
            }}
          >
            <Typography variant="subtitle1" fontWeight="bold">
              {account.bank_account_name || account.name || "Без названия"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {account.bank || account.bank_name}
            </Typography>
            <Typography
              variant="h6"
              fontWeight="bold"
              color="primary.main"
              sx={{ mt: 1 }}
            >
              {formattedBalance}
            </Typography>
          </Box>

          {hasBalance && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              На счету остались средства. Убедитесь, что вы перевели их на
              другой счет.
            </Alert>
          )}

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block", mt: 2 }}
          >
            Это действие нельзя отменить. Счет будет удален из вашего профиля.
          </Typography>
        </DialogContentText>
      </DialogContent>

      <DialogActions sx={{ p: 2, pt: 0, gap: 1 }}>
        <Button onClick={onClose} color="inherit" disabled={isLoading}>
          Отмена
        </Button>
        <Button
          onClick={onConfirm}
          color="error"
          variant="contained"
          disabled={isLoading}
          sx={{
            borderRadius: "12px",
            textTransform: "none",
          }}
        >
          {isLoading ? "Удаление..." : "Удалить счет"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
