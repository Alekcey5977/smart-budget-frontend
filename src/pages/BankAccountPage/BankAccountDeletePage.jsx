import {
  Dialog,
  DialogContent,
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
      onClose={isLoading ? undefined : onClose}
      PaperProps={{
        sx: {
          width: "calc(100% - 64px)",
          maxWidth: 306,
          borderRadius: "20px",
          bgcolor: "#fffdf4",
          boxShadow: "0 18px 44px rgba(0, 0, 0, 0.22)",
        },
      }}
    >
      <DialogContent sx={{ px: 2.25, pt: 2, pb: 1.5 }}>
        <Typography
          sx={{
            fontSize: 20,
            lineHeight: 1.15,
            fontWeight: 800,
            color: "text.primary",
            textAlign: "center",
          }}
        >
          Удалить счёт?
        </Typography>
        <Typography
          sx={{
            mt: 0.75,
            fontSize: 13,
            lineHeight: 1.35,
            fontWeight: 600,
            color: "text.secondary",
            textAlign: "center",
          }}
        >
          Счёт будет удалён из приложения.
        </Typography>

        <Box
          sx={{
            mt: 1.5,
            p: 1.5,
            borderRadius: "16px",
            bgcolor: "rgba(255, 255, 255, 0.62)",
            border: "1px solid rgba(0, 0, 0, 0.06)",
          }}
        >
          <Typography
            sx={{
              fontSize: 18,
              lineHeight: 1.2,
              fontWeight: 800,
              color: "text.primary",
            }}
          >
            {account.bank_account_name || account.name || "Без названия"}
          </Typography>
          <Typography
            sx={{
              mt: 0.25,
              fontSize: 13,
              lineHeight: 1.2,
              fontWeight: 700,
              color: "text.secondary",
            }}
          >
            {account.bank || account.bank_name || "Банк не указан"}
          </Typography>
          <Typography
            sx={{
              mt: 1,
              fontSize: 20,
              lineHeight: 1.1,
              fontWeight: 800,
              color: "text.primary",
            }}
          >
            {formattedBalance}
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 2, pt: 0, pb: 2, gap: 1 }}>
        <Button
          type="button"
          variant="outlined"
          onClick={onClose}
          disabled={isLoading}
          fullWidth
          sx={{
            height: 32,
            minHeight: 32,
            px: 1.5,
            py: 0,
            borderRadius: "12px",
            textTransform: "none",
            fontSize: 14,
            fontWeight: 800,
            borderColor: "rgba(0, 0, 0, 0.12)",
            color: "text.primary",
            bgcolor: "rgba(255, 255, 255, 0.52)",
            boxShadow: "none",
            "&:hover": {
              borderColor: "rgba(0, 0, 0, 0.18)",
              bgcolor: "rgba(255, 255, 255, 0.78)",
              boxShadow: "none",
            },
          }}
        >
          Отмена
        </Button>
        <Button
          type="button"
          onClick={onConfirm}
          color="error"
          variant="contained"
          disabled={isLoading}
          fullWidth
          sx={{
            height: 32,
            minHeight: 32,
            px: 1.5,
            py: 0,
            borderRadius: "12px",
            textTransform: "none",
            fontSize: 14,
            fontWeight: 800,
            bgcolor: "rgba(211, 47, 47, 0.1)",
            color: "#b91c1c",
            border: "1px solid rgba(211, 47, 47, 0.18)",
            boxShadow: "none",
            "&:hover": {
              bgcolor: "rgba(211, 47, 47, 0.16)",
              boxShadow: "none",
            },
          }}
        >
          {isLoading ? "Удаление..." : "Удалить"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
