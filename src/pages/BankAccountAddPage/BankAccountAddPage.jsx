import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Alert, Box } from "@mui/material";
import AppButton from "ui/AppButton/AppButton";
import AppTextField from "ui/AppTextField/AppTextField";
import { useAddBankAccountMutation } from "services/auth/bankApi";
import styles from "./BankAccountAddPage.module.scss";
import { translateError } from "utils/errorHelpers";

export default function BankAccountAddPage() {
  const navigate = useNavigate();
  const [addAccount, { isLoading, error }] = useAddBankAccountMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onBlur" });

  const onSubmit = useCallback(
    async (data) => {
      try {
        await addAccount({
          number: data.number,
          name: data.name || "Новый счёт",
          bank: data.bank,
        }).unwrap();

        navigate("/bank-accounts");
      } catch (err) {
        console.error("Failed to add account", err);
      }
    },
    [addAccount, navigate],
  );

  const errorMessage = error?.data ? translateError(error.data) : "Ошибка добавления счёта";

  return (
    <div className={styles.page}>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.fields}>
          <AppTextField
            label="Номер счёта"
            placeholder="40817810..."
            error={!!errors.number}
            helperText={errors.number?.message}
            disabled={isLoading}
            {...register("number", {
              required: "Введите номер счёта",
              minLength: {
                value: 16,
                message: "Минимум 16 цифр",
              },
              pattern: {
                value: /^[0-9]+$/,
                message: "Только цифры",
              },
            })}
          />
          <AppTextField
            label="Название счёта (не обязательно)"
            placeholder="Например: Основная карта"
            disabled={isLoading}
            {...register("name")}
          />

          <AppTextField
            label="Ваш банк"
            placeholder="Сбербанк"
            error={!!errors.bank}
            helperText={errors.bank?.message}
            disabled={isLoading}
            {...register("bank", {
              required: "Введите название банка",
            })}
          />
          <Box sx={{ minHeight: "60px", mt: 1 }}>
            {error && (
              <Alert severity="error">
                {typeof errorMessage === "string"
                  ? errorMessage
                  : JSON.stringify(errorMessage)}
              </Alert>
            )}
          </Box>
        </div>

        <div className={styles.footer}>
          <AppButton type="submit" disabled={isLoading}>
            {isLoading ? "Добавление..." : "Добавить счёт"}
          </AppButton>
        </div>
      </form>
    </div>
  );
}
