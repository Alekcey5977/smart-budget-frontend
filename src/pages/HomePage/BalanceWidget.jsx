import { useMemo } from "react";
import { Paper, Typography, Box, IconButton } from "@mui/material";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import { useGetBankAccountsQuery } from "services/auth/bankApi";
import { formatMoney } from "utils/formatMoney";
import classNames from "classnames";
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

  const hasAccounts = accounts.length > 0;

  return (
    <Paper
      variant="outlined"
      className={classNames(styles.card, styles.balanceWidgetCard)}
      onClick={() => navigate("/bank-accounts")}
    >
      <Typography 
        variant="h6" 
        fontWeight={800} 
        sx={{ fontSize: "18px", mb: hasAccounts ? 0.5 : 0 }}
      >
        Баланс
      </Typography>

      {isLoading ? (
        <Typography variant="caption" color="text.secondary">
          Загрузка...
        </Typography>
      ) : !hasAccounts ? (
        <Box
          className={styles.addAccountBox}
          onClick={(e) => {
            e.stopPropagation();
            navigate("/bank-accounts/add");
          }}
        >
          <Typography 
            variant="subtitle2" 
            fontWeight={700} 
            sx={{ 
              fontSize: "14px", 
              color: "text.primary", 
              textAlign: "center",
              lineHeight: 1.2
            }}
          >
            Добавить счет
          </Typography>
          <Box className={styles.addIconWrap}>
            <AddIcon sx={{ fontSize: 20, color: "text.primary" }} />
          </Box>
        </Box>
      ) : (
        <>
          <Typography 
            variant="body1" 
            fontWeight={700} 
            className={styles.totalBalance}
          >
            {formatMoney(totalBalance)} ₽
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.3 }}>
            {accounts.slice(0, 3).map((acc) => (
              <Box
                key={acc.bank_account_id || acc.id}
                sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
              >
                <AccountBalanceWalletIcon
                  sx={{ fontSize: 12, color: "text.secondary", flexShrink: 0 }}
                />
                <Typography 
                  variant="caption" 
                  color="text.secondary" 
                  noWrap 
                  sx={{ fontSize: "11px" }}
                >
                  {acc.bank_account_name || acc.name || "Счет"}
                </Typography>
              </Box>
            ))}
          </Box>
        </>
      )}
    </Paper>
  );
}
