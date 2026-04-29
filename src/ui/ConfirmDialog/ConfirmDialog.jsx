import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
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
          width: "calc(100% - 56px)",
          maxWidth: 320,
          borderRadius: "20px",
        },
      }}
    >
      <DialogTitle sx={{ px: 2.5, pt: 2.5, pb: 0.75, fontWeight: 700, fontSize: 22 }}>
        {title}
      </DialogTitle>
      {text && (
        <DialogContent sx={{ px: 2.5, pt: 0, pb: 1 }}>
          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.35 }}>
            {text}
          </Typography>
        </DialogContent>
      )}
      <DialogActions sx={{ px: 2.5, pb: 2.5, gap: 1 }}>
        <Button
          type="button"
          variant="outlined"
          onClick={onClose}
          disabled={isLoading}
          fullWidth
          sx={{ minHeight: 48, borderRadius: "14px", textTransform: "none" }}
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
          sx={{ minHeight: 48, borderRadius: "14px", textTransform: "none" }}
        >
          {isLoading ? "Удаление..." : confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
