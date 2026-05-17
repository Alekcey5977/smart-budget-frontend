import { useMemo } from "react";
import { Paper, Typography, Box } from "@mui/material";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import { useGetBankAccountsQuery } from "services/auth/bankApi";
import { formatCurrency } from "utils/formatMoney";
import classNames from "classnames";
import styles from "./HomePage.module.scss";

export default function BalanceWidget() {
  const navigate = useNavigate();
  const { data: accountsData = [], isLoading } = useGetBankAccountsQuery();
  const accounts = Array.isArray(accountsData) ? accountsData : [];

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
      sx={{ height: "100%" }}
      onClick={() => navigate("/bank-accounts")}
    >
      <Box className={styles.balanceHeader} sx={{ mb: hasAccounts ? 0.5 : 0 }}>
        <Typography
          variant="h6"
          fontWeight={800}
          sx={{ fontSize: "18px" }}
        >
          Баланс
        </Typography>
        {hasAccounts && (
          <button
            type="button"
            className={styles.goalAddButton}
            onClick={(e) => {
              e.stopPropagation();
              navigate("/bank-accounts/add");
            }}
          >
            <AddIcon fontSize="small" />
          </button>
        )}
      </Box>

      {isLoading ? (
        <Typography variant="caption" color="text.secondary">
          Загрузка...
        </Typography>
      ) : (
        <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
          {hasAccounts ? (
            <>
              <Typography
                variant="body1"
                fontWeight={700}
                className={styles.totalBalance}
              >
                {formatCurrency(totalBalance)}
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
          ) : (
            <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
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
                  className={styles.addAccountText}
                >
                  Добавить счет
                </Typography>
                <Box className={styles.addIconWrap} sx={{ width: 32, height: 32 }}>
                  <AddIcon sx={{ fontSize: 20, color: "text.primary" }} />
                </Box>
              </Box>
            </Box>
          )}
        </Box>
      )}
    </Paper>
  );
}
