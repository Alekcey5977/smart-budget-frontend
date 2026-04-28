import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import AppButton from "ui/AppButton/AppButton";
import {
  useGetBankAccountsQuery,
  useDeleteBankAccountMutation,
} from "services/auth/bankApi";
import BankAccountPage from "./BankAccountDeletePage.jsx";
import styles from "./BankAccountPage.module.scss";


const AccountCard = ({ account, onDelete }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = () => {
    handleMenuClose();
    onDelete(account);
  };

  const formattedBalance = new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: account.currency || "RUB",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(account.balance || 0);

  const accountNumber = account.number || account.account_number;

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.cardInfo}>
          <div className={styles.cardName}>
            <CreditCardIcon />
            <h6>{account.bank_account_name || account.name || "Новый счет"}</h6>
          </div>
          <div className={styles.cardBank}>
            <AccountBalanceIcon />
            <span>{account.bank || account.bank_name || "Банк не указан"}</span>
          </div>
          {accountNumber && (
            <div className={styles.cardNumber}>{accountNumber}</div>
          )}
        </div>

        <IconButton
          onClick={handleMenuClick}
          size="small"
          className={styles.menuButton}
        >
          <MoreVertIcon />
        </IconButton>
      </div>

      <div className={styles.cardBalance}>
        <div className={styles.balanceAmount}>{formattedBalance}</div>
      </div>

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
        <MenuItem onClick={handleDelete} sx={{ color: "error.main" }}>
          <ListItemIcon sx={{ color: "error.main", minWidth: "32px" }}>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Удалить счет" />
        </MenuItem>
      </Menu>
    </div>
  );
};

export default function BankAccountsPage() {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useGetBankAccountsQuery();
  const [deleteBankAccount, { isLoading: isDeleting }] =
    useDeleteBankAccountMutation();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const accounts = Array.isArray(data) ? data : [];

  const handleDeleteClick = useCallback((account) => {
    setSelectedAccount(account);
    setDeleteDialogOpen(true);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!selectedAccount) return;

    try {
      await deleteBankAccount(
        selectedAccount.bank_account_id || selectedAccount.id,
      ).unwrap();
    } catch (error) {
      console.error("Error deleting account:", error);
      setSnackbar({
        open: true,
        message:
          error?.data?.detail ||
          error?.data?.message ||
          "Ошибка при удалении счета",
        severity: "error",
      });
    } finally {
      setDeleteDialogOpen(false);
      setSelectedAccount(null);
    }
  }, [selectedAccount, deleteBankAccount]);

  const handleDeleteCancel = useCallback(() => {
    setDeleteDialogOpen(false);
    setSelectedAccount(null);
  }, []);

  const handleAddAccount = () => {
    navigate("/bank-accounts/add");
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (isLoading) {
    return (
      <div className={styles.center}>
        <CircularProgress />
      </div>
    );
  }

  if (isError) {
    return (
      <div className={styles.center}>
        <Typography color="error">Ошибка загрузки счетов</Typography>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        {accounts.length === 0 ? (
          <div className={styles.empty}>
            <Typography variant="subtitle1" color="text.secondary" align="center">
              Банковских счетов нет
            </Typography>
          </div>
        ) : (
          <div className={styles.list}>
            {accounts.map((acc) => (
              <AccountCard
                key={acc.bank_account_id || acc.id}
                account={acc}
                onDelete={handleDeleteClick}
              />
            ))}
          </div>
        )}
      </div>

      <div className={styles.footer}>
        <AppButton onClick={handleAddAccount}>Добавить счет</AppButton>
      </div>

      <BankAccountPage
        open={deleteDialogOpen}
        account={selectedAccount}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}
