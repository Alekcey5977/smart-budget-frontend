import { useState, useCallback, useRef } from "react";
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
  TextField,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import AppButton from "ui/AppButton/AppButton";
import {
  useGetBankAccountsQuery,
  useDeleteBankAccountMutation,
  useRenameBankAccountMutation,
} from "services/auth/bankApi";
import BankAccountPage from "./BankAccountDeletePage.jsx";
import styles from "./BankAccountPage.module.scss";


const AccountCard = ({ account, onDelete }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(
    account.bank_account_name || account.name || "",
  );
  const inputRef = useRef(null);
  const open = Boolean(anchorEl);
  const [renameBankAccount, { isLoading: isRenaming }] =
    useRenameBankAccountMutation();

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

  const handleRenameStart = () => {
    handleMenuClose();
    setEditName(account.bank_account_name || account.name || "");
    setIsEditing(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handleRenameConfirm = async () => {
    const trimmed = editName.trim();
    if (!trimmed) return;
    const id = account.bank_account_id || account.id;
    await renameBankAccount({ id, name: trimmed });
    setIsEditing(false);
  };

  const handleRenameCancel = () => {
    setIsEditing(false);
    setEditName(account.bank_account_name || account.name || "");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleRenameConfirm();
    if (e.key === "Escape") handleRenameCancel();
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
            {isEditing ? (
              <TextField
                inputRef={inputRef}
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onKeyDown={handleKeyDown}
                size="small"
                variant="standard"
                disabled={isRenaming}
                sx={{ flex: 1 }}
                inputProps={{ style: { fontSize: "inherit", fontWeight: 600 } }}
              />
            ) : (
              <h6>{account.bank_account_name || account.name || "Новый счет"}</h6>
            )}
          </div>
          <div className={styles.cardBank}>
            <AccountBalanceIcon />
            <span>{account.bank || account.bank_name || "Банк не указан"}</span>
          </div>
          {accountNumber && (
            <div className={styles.cardNumber}>{accountNumber}</div>
          )}
        </div>

        {isEditing ? (
          <div style={{ display: "flex", gap: 2 }}>
            <IconButton
              size="small"
              onClick={handleRenameConfirm}
              disabled={isRenaming}
              color="primary"
            >
              <CheckIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" onClick={handleRenameCancel}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </div>
        ) : (
          <IconButton
            onClick={handleMenuClick}
            size="small"
            className={styles.menuButton}
          >
            <MoreVertIcon />
          </IconButton>
        )}
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
        <MenuItem onClick={handleRenameStart}>
          <ListItemIcon sx={{ minWidth: "32px" }}>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Переименовать" />
        </MenuItem>
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
