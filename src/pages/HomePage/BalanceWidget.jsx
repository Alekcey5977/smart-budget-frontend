import { useMemo } from "react";
import { Paper, Typography, Box } from "@mui/material";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { useNavigate } from "react-router-dom";
import { useGetBankAccountsQuery } from "services/auth/bankApi";
import { formatMoney } from "utils/formatMoney";
import styles from "./HomePage.module.scss";

export default function BalanceWidget() {
  const navigate = useNavigate();
  const { data: accounts = [], isLoading } = useGetBankAccountsQuery();

  const totalBalance = useMemo(() => {
    if (!accounts || accounts.length === 0) return 0;
    return accounts.reduce((sum, account) => {
      const balanceNumber = parseFloat(account.balance) || 0;
      return sum + balanceNumber;
    }, 0);
  }, [accounts]);

  return (
    <Paper
      variant="outlined"
      className={styles.card}
      onClick={() => navigate("/bank-accounts")}
      sx={{ cursor: "pointer", minHeight: "140px" }}
    >
      <Typography variant="subtitle1" fontWeight={700}>
        Баланс
      </Typography>

      <Typography variant="body2" fontWeight={700} mb={1}>
        {isLoading ? "Загрузка..." : `${formatMoney(totalBalance)} ₽`}
      </Typography>

      <Box sx={{ mt: 1, display: "flex", flexDirection: "column", gap: 0.5 }}>
        {accounts.slice(0, 3).map((acc) => (
          <Box
            key={acc.bank_account_id || acc.id}
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <AccountBalanceWalletIcon sx={{ fontSize: 14, color: "text.secondary" }} />
            <Typography variant="caption" color="text.secondary" noWrap>
              {acc.bank_account_name || acc.name || "Без названия"}
            </Typography>
          </Box>
        ))}
      </Box>
    </Paper>
  );
}
