import { useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { Stack, Typography, Alert } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import AppButton from "ui/AppButton/AppButton";
import AppTextField from "ui/AppTextField/AppTextField";
import styles from "./ProfilePage.module.scss";
import {
  useGetMeQuery,
  useUpdateUserMutation,
} from "src/services/auth/authApi";

export default function ProfilePage() {
  const { data: user, isLoading } = useGetMeQuery();

  const [updateUser, { isLoading: isUpdating, isSuccess, error: updateError }] =
    useUpdateUserMutation();

  const { register, handleSubmit, reset } = useForm();

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

  if (isLoading) return <div className={styles.page}>Загрузка...</div>;

  return (
    <div className={styles.page}>
      <div className={styles.top}>
        <Stack alignItems="center" spacing={2}>
          <div className={styles.avatar}>
            <PersonIcon style={{ fontSize: 40, opacity: 0.6 }} />
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
