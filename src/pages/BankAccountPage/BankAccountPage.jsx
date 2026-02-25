import { useNavigate } from "react-router-dom";
import { Typography, CircularProgress } from "@mui/material";
import AppButton from "ui/AppButton/AppButton";
import { useGetBankAccountsQuery } from "services/auth/bankApi";
import styles from "./BankAccountPage.module.scss";

const AccountCard = ({ account }) => (
  <div className={styles.card}>
    <div className={styles.cardHeader}>
      <Typography variant="body1" fontWeight={600}>
        {account.bank_account_name}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {account.bank}
      </Typography>
    </div>
    <div className={styles.cardBody}>
      <Typography variant="h6" fontWeight={700}>
        {Number(account.balance).toLocaleString("ru-RU")} {account.currency}
      </Typography>
    </div>
  </div>
);

export default function BankAccountsPage() {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useGetBankAccountsQuery();

  const accounts = Array.isArray(data) ? data : [];

  if (isLoading)
    return (
      <div className={styles.center}>
        <CircularProgress />
      </div>
    );
  if (isError)
    return <div className={styles.center}>Ошибка загрузки счетов</div>;

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        {accounts.length === 0 ? (
          <div className={styles.empty}>
            <Typography variant="body1" color="text.secondary" align="center">
              Банковских счетов нет
            </Typography>
          </div>
        ) : (
          <div className={styles.list}>
            {accounts.map((acc) => (
              <AccountCard key={acc.bank_account_id} account={acc} />
            ))}
          </div>
        )}
      </div>

      <div className={styles.footer}>
        <AppButton onClick={() => navigate("/bank-accounts/add")}>
          Добавить счёт
        </AppButton>
      </div>
    </div>
  );
}
