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
  useUpdateTransactionCategoryMutation,
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
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [currentOperation, setCurrentOperation] = useState(null);
  const [errorText, setErrorText] = useState("");
  const categoryDialogOpen = Boolean(categoryAnchorEl);
  const [updateTransactionCategory, { isLoading: isUpdatingCategory }] =
    useUpdateTransactionCategoryMutation();

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
    const fromQuery = operations.find((item) => item.id === operationId);
    if (fromQuery) {
      return fromQuery;
    }

    const fromState = location.state?.operation;
    if (fromState?.id === operationId) {
      return fromState;
    }

    return null;
  }, [location.state, operationId, operations]);

  useEffect(() => {
    if (!operation) {
      return;
    }

    setCurrentOperation(operation);
    setSelectedCategoryId(operation.category_id ?? null);
  }, [operation]);

  const visibleOperation = currentOperation || operation;
  const selectedCategory = categories.find(
    (category) => Number(category.id) === Number(selectedCategoryId),
  );

  const handleCategoryClose = () => {
    setCategoryAnchorEl(null);
    setSelectedCategoryId(visibleOperation?.category_id ?? null);
  };

  const handleCategorySave = async () => {
    if (!visibleOperation || selectedCategoryId == null) {
      handleCategoryClose();
      return;
    }

    if (Number(selectedCategoryId) === Number(visibleOperation.category_id)) {
      setCategoryAnchorEl(null);
      return;
    }

    setErrorText("");

    try {
      const updatedOperation = await updateTransactionCategory({
        transactionId: visibleOperation.id,
        category_id: Number(selectedCategoryId),
      }).unwrap();

      setCurrentOperation(updatedOperation);
      setSelectedCategoryId(updatedOperation.category_id ?? null);
      setCategoryAnchorEl(null);
    } catch (error) {
      const message = error?.data?.detail;
      const status = error?.status;

      if (status === 401) {
        setErrorText("Нужно заново войти в аккаунт");
      } else if (status === 404) {
        setErrorText("Не удалось изменить категорию");
      } else if (typeof message === "string" && message !== "Not Found") {
        setErrorText(message);
      } else {
        setErrorText("Не удалось сохранить категорию");
      }
    }
  };

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
      {errorText && <Alert severity="error">{errorText}</Alert>}

      <div className={styles.topBar}>
        <IconButton aria-label="Удалить" size="small">
          <DeleteOutlineIcon />
        </IconButton>
      </div>

      <div className={styles.amountCard}>
        <div
          className={styles.operationCircle}
          style={{ backgroundColor: getOperationColor(visibleOperation) }}
        />

        <div className={styles.amountCardRight}>
          <Typography variant="h5" className={styles.amountValue}>
            {getOperationSignedAmount(visibleOperation)}
          </Typography>
          <Typography variant="h6" fontWeight={700}>
            {getOperationTitle(visibleOperation)}
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
            {formatOperationDateTime(visibleOperation.created_at)}
          </Typography>
        </div>

        <div className={styles.categoryRow}>
          <div className={styles.detailBlock}>
            <div className={styles.detailLabel}>Категория</div>
            <Typography variant="h6" fontWeight={700}>
              {selectedCategory?.name || visibleOperation.category_name || "—"}
            </Typography>
          </div>

          <IconButton
            aria-label="Изменить категорию"
            disabled={isUpdatingCategory}
            onClick={(event) => setCategoryAnchorEl(event.currentTarget)}
          >
            <EditOutlinedIcon />
          </IconButton>
        </div>
      </div>

      <Popover
        open={categoryDialogOpen}
        anchorEl={categoryAnchorEl}
        onClose={handleCategoryClose}
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
                Number(selectedCategoryId) === Number(category.id)
                  ? styles.categoryButtonActive
                  : ""
              }`}
              onClick={() => setSelectedCategoryId(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>

        <div className={styles.popoverActions}>
          <button
            type="button"
            className={styles.popoverActionButton}
            onClick={handleCategoryClose}
            disabled={isUpdatingCategory}
          >
            Отмена
          </button>
          <button
            type="button"
            className={styles.popoverActionButton}
            onClick={handleCategorySave}
            disabled={isUpdatingCategory}
          >
            {isUpdatingCategory ? "Сохранение..." : "ОК"}
          </button>
        </div>
      </Popover>
    </div>
  );
}
