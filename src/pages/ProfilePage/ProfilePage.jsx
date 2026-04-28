import { useEffect, useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Stack,
  Typography,
  Alert,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import HistoryIcon from "@mui/icons-material/History";
import { useOutletContext, useNavigate } from "react-router-dom";
import AppButton from "ui/AppButton/AppButton";
import AppTextField from "ui/AppTextField/AppTextField";
import styles from "./ProfilePage.module.scss";
import { useGetMeQuery, useUpdateUserMutation } from "src/services/auth/authApi";
import { useGetMyAvatarQuery } from "src/services/auth/avatarApi";

export default function ProfilePage() {
  const { setPageHeaderAction } = useOutletContext();
  const navigate = useNavigate();
  const { data: user, isLoading } = useGetMeQuery();
  const { data: myAvatar } = useGetMyAvatarQuery();

  const [updateUser, { isLoading: isUpdating, isSuccess, error: updateError }] =
    useUpdateUserMutation();

  const { register, handleSubmit, reset } = useForm();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  useEffect(() => {
    if (user) {
      reset({
        lastName: user.last_name || "",
        firstName: user.first_name || "",
        middleName: user.middle_name || "",
      });
    }
  }, [user, reset]);

  const handleSave = useCallback(
    async (data) => {
      try {
        console.log("Updating profile...", data);
        await updateUser(data).unwrap();
      } catch (err) {
        console.error("Update failed", err);
      }
    },
    [updateUser],
  );

  useEffect(() => {
    setPageHeaderAction(
      <>
        <IconButton onClick={handleMenuOpen} sx={{ color: "text.primary" }}>
          <MoreVertIcon />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <MenuItem
            onClick={() => {
              handleMenuClose();
              navigate("/history");
            }}
          >
            <ListItemIcon>
              <HistoryIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="История" />
          </MenuItem>
        </Menu>
      </>,
    );
    return () => setPageHeaderAction(null);
  }, [setPageHeaderAction, anchorEl, open, navigate]);

  return (
    <div className={styles.page}>
      <div className={styles.top}>
        <Stack alignItems="center" spacing={2}>
          <div
            className={styles.avatar}
            style={{ backgroundColor: "#cbcbcb", overflow: "hidden" }}
          >
            {myAvatar?.image_id || myAvatar?.id ? (
              <img
                src={`/images/${myAvatar.image_id || myAvatar.id}`}
                alt="Avatar"
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
            ) : (
              <PersonIcon style={{ fontSize: 40, opacity: 0.6 }} />
            )}
          </div>

          <Typography variant="h6" fontWeight={800}>
            {user?.email}
          </Typography>
        </Stack>

        {isSuccess && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Профиль сохранен!
          </Alert>
        )}
        {updateError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Ошибка сохранения
          </Alert>
        )}

        <form className={styles.fields} onSubmit={handleSubmit(handleSave)}>
          <AppTextField
            label="Фамилия"
            {...register("lastName")}
            InputLabelProps={{ shrink: true }}
            disabled={isUpdating}
          />
          <AppTextField
            label="Имя"
            {...register("firstName")}
            InputLabelProps={{ shrink: true }}
            disabled={isUpdating}
          />
          <AppTextField
            label="Отчество"
            {...register("middleName")}
            InputLabelProps={{ shrink: true }}
            disabled={isUpdating}
          />
        </form>
      </div>

      <div className={styles.bottom}>
        <AppButton onClick={handleSubmit(handleSave)} disabled={isUpdating}>
          {isUpdating ? "Сохранение..." : "Сохранить"}
        </AppButton>
      </div>
    </div>
  );
}
