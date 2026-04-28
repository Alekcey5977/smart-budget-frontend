import React from "react";
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Typography,
  Box,
} from "@mui/material";

export default function DeleteAccountDialog({
  open,
  account,
  onClose,
  onConfirm,
  isLoading,
}) {
  if (!account) return null;
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
      PaperProps={{
        sx: {
          borderRadius: "20px",
          maxWidth: "90%",
          width: "320px",
          margin: "16px",
        },
      }}
    >

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
              color="text.primary"
              sx={{ mt: 1 }}
            >
              {formattedBalance}
            </Typography>
          </Box>


        </DialogContentText>
      </DialogContent>

      <DialogActions sx={{ p: 2, pt: 0, justifyContent: "center" }}>
        <Button
          onClick={onConfirm}
          color="error"
          variant="outlined"
          disabled={isLoading}
          fullWidth
          sx={{
            borderRadius: "12px",
            textTransform: "none",
            borderWidth: 2,
            "&:hover": {
              borderWidth: 2
            }
          }}
        >
          {isLoading ? "Удаление..." : "Удалить счет"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
