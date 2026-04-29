import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
} from "@mui/material";

export default function ConfirmDialog({
  open,
  title,
  text,
  confirmText = "Удалить",
  cancelText = "Отмена",
  isLoading = false,
  onClose,
  onConfirm,
}) {
  return (
    <Dialog
      open={open}
      onClose={isLoading ? undefined : onClose}
      PaperProps={{
        sx: {
          width: "calc(100% - 64px)",
          maxWidth: 276,
          borderRadius: "22px",
          bgcolor: "#fffdf4",
          boxShadow: "0 18px 44px rgba(0, 0, 0, 0.22)",
        },
      }}
    >
      <DialogTitle
        sx={{
          px: 2.5,
          pt: 2.25,
          pb: 1.5,
          fontWeight: 800,
          fontSize: 21,
          lineHeight: 1.15,
          textAlign: "center",
        }}
      >
        {title}
      </DialogTitle>
      <DialogActions sx={{ px: 2, pb: 2, gap: 1 }}>
        <Button
          type="button"
          variant="outlined"
          onClick={onClose}
          disabled={isLoading}
          fullWidth
          sx={{
            minHeight: 40,
            borderRadius: "14px",
            textTransform: "none",
            fontSize: 16,
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
          {cancelText}
        </Button>
        <Button
          type="button"
          variant="contained"
          color="error"
          onClick={onConfirm}
          disabled={isLoading}
          fullWidth
          sx={{
            minHeight: 40,
            borderRadius: "14px",
            textTransform: "none",
            fontSize: 16,
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
          {isLoading ? "Удаление..." : confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
