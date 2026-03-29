import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  CircularProgress,
  Box,
  Typography,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import {
  useGetDefaultAvatarsQuery,
  useUpdateMyAvatarMutation,
} from "services/auth/avatarApi";

export default function AvatarSelector({ open, onClose }) {
  const [selectedAvatarId, setSelectedAvatarId] = useState(null);

  const {
    data: defaultAvatars = [],
    isLoading: isFetchingAvatars,
    isError: isFetchError,
  } = useGetDefaultAvatarsQuery(undefined, {
    skip: !open,
  });

  const [updateAvatar, { isLoading: isUpdating }] = useUpdateMyAvatarMutation();

  useEffect(() => {
    if (open) {
      setSelectedAvatarId(null);
    }
  }, [open]);

  const handleSave = async () => {
    if (!selectedAvatarId) return;
    try {
      await updateAvatar(selectedAvatarId).unwrap();
      onClose();
    } catch (error) {
    }
  };

  const avatarsList = Array.isArray(defaultAvatars)
    ? defaultAvatars
    : defaultAvatars?.data || defaultAvatars?.items || defaultAvatars?.images || [];

  return (
    <Dialog
      open={open}
      onClose={isUpdating ? undefined : onClose}
      maxWidth={false}
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "28px",
          p: 1,
          width: "calc(100% - 32px)",
          maxWidth: "340px",
          margin: "16px",
          backgroundColor: "#f9f7f2",
        },
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2, textAlign: "center", fontWeight: "bold" }}>
        Выберите аватар
        <IconButton
          aria-label="close"
          onClick={onClose}
          disabled={isUpdating}
          sx={{
            position: "absolute",
            right: 16,
            top: 16,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent dividers sx={{ borderBottom: "none", borderTop: "1px solid #eee" }}>
        <Box sx={{ minHeight: 200, display: "flex", flexDirection: "column" }}>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
            Пожалуйста, выберите одну из стандартных картинок для вашего профиля.
          </Typography>

          {isFetchingAvatars ? (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", flex: 1 }}>
              <CircularProgress />
            </Box>
          ) : isFetchError ? (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", flex: 1 }}>
              <Typography color="error">Ошибка при загрузке аватарок</Typography>
            </Box>
          ) : avatarsList.length === 0 ? (
            <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", flex: 1 }}>
              <Typography color="text.secondary" align="center">
                Список аватарок пуст
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={2} justifyContent="center">
              {avatarsList.map((avatar) => {
                const isSelected = selectedAvatarId === avatar.id;
                const imageUrl = `/images/images/${avatar.id}`;
                return (
                  <Grid item key={avatar.id}>
                    <Box
                      onClick={() => !isUpdating && setSelectedAvatarId(avatar.id)}
                      sx={{
                        width: 70,
                        height: 70,
                        borderRadius: "50%",
                        overflow: "hidden",
                        border: isSelected ? "4px solid" : "4px solid transparent",
                        borderColor: isSelected ? "primary.main" : "transparent",
                        cursor: isUpdating ? "default" : "pointer",
                        position: "relative",
                        transition: "all 0.2s ease-in-out",
                        "&:hover": {
                          borderColor: isSelected ? "primary.main" : "primary.light",
                          transform: isUpdating ? "none" : "scale(1.05)",
                        },
                      }}
                    >
                      <Box
                        component="img"
                        src={imageUrl}
                        alt="Avatar Option"
                        sx={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                      {isSelected && (
                        <CheckCircleIcon
                          color="primary"
                          sx={{
                            position: "absolute",
                            bottom: 0,
                            right: 0,
                            backgroundColor: "white",
                            borderRadius: "50%",
                          }}
                        />
                      )}
                    </Box>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, justifyContent: "center" }}>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={!selectedAvatarId || isUpdating}
          sx={{
            py: 1.5,
            px: 4,
            borderRadius: 8,
            fontWeight: "bold",
            textTransform: "none",
          }}
        >
          {isUpdating ? <CircularProgress size={24} color="inherit" /> : "Сохранить"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
