import { useMemo } from "react";
import { Paper, Typography, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
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
      sx={{ cursor: "pointer" }}
    >
      <Typography variant="subtitle1" fontWeight={700}>
        Баланс
      </Typography>

      <Typography variant="body2" fontWeight={700} mb={1}>
        {isLoading ? "Загрузка..." : `${formatMoney(totalBalance)} ₽`}
      </Typography>

      <div className={styles.cardRow}>
        <CreditCardOutlinedIcon />
        <IconButton
          aria-label="Добавить"
          onClick={(e) => {
            e.stopPropagation();
            navigate("/bank-accounts/add");
          }}
          sx={{
            bgcolor: "primary.main",
            width: 44,
            height: 44,
            borderRadius: 3,
            "&:hover": { bgcolor: "primary.main" },
          }}
        >
          <AddIcon />
        </IconButton>
      </div>
    </Paper>
  );
}
