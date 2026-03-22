import {
  Alert,
  CircularProgress,
  IconButton,
  Popover,
  Typography,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useParams } from "react-router-dom";

import { useGetBankAccountsQuery } from "services/auth/bankApi";
import {
  useGetTransactionCategoriesQuery,
  useGetTransactionsQuery,
} from "services/transactions/transactionsApi";
import { formatMoney } from "utils/formatMoney";
import {
  formatOperationDateTime,
  getOperationColor,
  getOperationSignedAmount,
  getOperationTitle,
} from "utils/operationHelpers";
import styles from "./OperationDetailsPage.module.scss";

export default function OperationDetailsPage() {
  const { operationId } = useParams();
  const location = useLocation();
  const [categoryAnchorEl, setCategoryAnchorEl] = useState(null);
  const [selectedCategoryName, setSelectedCategoryName] = useState("");
  const categoryDialogOpen = Boolean(categoryAnchorEl);

  const { data: operationsData, isLoading, isError } = useGetTransactionsQuery({
    limit: 100,
    offset: 0,
  });
  const { data: categoriesData = [] } = useGetTransactionCategoriesQuery();
  const { data: accountsData = [] } = useGetBankAccountsQuery();

  const operations = Array.isArray(operationsData) ? operationsData : [];
  const categories = Array.isArray(categoriesData) ? categoriesData : [];
  const accounts = Array.isArray(accountsData) ? accountsData : [];

  const operation = useMemo(() => {
    const fromState = location.state?.operation;
    if (fromState?.id === operationId) {
      return fromState;
    }

    return operations.find((item) => item.id === operationId);
  }, [location.state, operationId, operations]);

  useEffect(() => {
    if (!operation) {
      return;
    }

    setSelectedCategoryName(operation.category_name || "");
  }, [operation]);

  if (isLoading) {
    return (
      <div className={styles.center}>
        <CircularProgress size={24} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className={styles.center}>
        <Alert severity="error" className={styles.alert}>
          Не удалось загрузить операцию
        </Alert>
      </div>
    );
  }

  if (!operation) {
    return (
      <div className={styles.center}>
        <Alert severity="warning" className={styles.alert}>
          Операция не найдена
        </Alert>
      </div>
    );
  }

  const account = accounts[0];

  return (
    <div className={styles.root}>
      <div className={styles.topBar}>
        <IconButton aria-label="Удалить" size="small">
          <DeleteOutlineIcon />
        </IconButton>
      </div>

      <div className={styles.amountCard}>
        <div
          className={styles.operationCircle}
          style={{ backgroundColor: getOperationColor(operation) }}
        />

        <div className={styles.amountCardRight}>
          <Typography variant="h5" className={styles.amountValue}>
            {getOperationSignedAmount(operation)}
          </Typography>
          <Typography variant="h6" fontWeight={700}>
            {getOperationTitle(operation)}
          </Typography>
        </div>
      </div>

      <div className={styles.detailsCard}>
        <div className={styles.detailsTitle}>Подробности</div>

        <div className={styles.detailBlock}>
          <div className={styles.detailLabel}>Баланс</div>
          <Typography variant="h6" fontWeight={700}>
            {account
              ? `${formatMoney(account.balance)} ${account.currency || "RUB"}`
              : "—"}
          </Typography>
        </div>

        <div className={styles.detailBlock}>
          <div className={styles.detailLabel}>Карта списание</div>
          <Typography variant="h6" fontWeight={700}>
            {account ? account.bank_account_name : "—"}
          </Typography>
        </div>

        <div className={styles.detailBlock}>
          <div className={styles.detailLabel}>Дата и время</div>
          <Typography variant="h6" fontWeight={700}>
            {formatOperationDateTime(operation.created_at)}
          </Typography>
        </div>

        <div className={styles.categoryRow}>
          <div className={styles.detailBlock}>
            <div className={styles.detailLabel}>Категория</div>
            <Typography variant="h6" fontWeight={700}>
              {selectedCategoryName || operation.category_name || "—"}
            </Typography>
          </div>

          <IconButton
            aria-label="Изменить категорию"
            onClick={(event) => setCategoryAnchorEl(event.currentTarget)}
          >
            <EditOutlinedIcon />
          </IconButton>
        </div>
      </div>

      <Popover
        open={categoryDialogOpen}
        anchorEl={categoryAnchorEl}
        onClose={() => setCategoryAnchorEl(null)}
        disablePortal
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        PaperProps={{ className: styles.popoverPaper }}
      >
        <div className={styles.categoryList}>
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              className={`${styles.categoryButton} ${
                selectedCategoryName === category.name
                  ? styles.categoryButtonActive
                  : ""
              }`}
              onClick={() => {
                setSelectedCategoryName(category.name);
                setCategoryAnchorEl(null);
              }}
            >
              {category.name}
            </button>
          ))}
        </div>
      </Popover>
    </div>
  );
}
