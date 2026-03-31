import {
  Alert,
  CircularProgress,
  IconButton,
  Popover,
  Typography,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import { useGetBankAccountsQuery } from "services/auth/bankApi";
import {
  useGetTransactionCategoriesQuery,
  useGetTransactionByIdQuery,
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
  const [categoryAnchorEl, setCategoryAnchorEl] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [errorText, setErrorText] = useState("");
  const categoryDialogOpen = Boolean(categoryAnchorEl);
  const [updateTransactionCategory, { isLoading: isUpdatingCategory }] =
    useUpdateTransactionCategoryMutation();

  const { data: operationData, isLoading, isError } =
    useGetTransactionByIdQuery(operationId, {
      skip: !operationId,
    });
  const operationType = operationData?.type;
  const { data: categoriesData } = useGetTransactionCategoriesQuery(
    operationType ? { type: operationType } : undefined,
  );
  const { data: accountsData } = useGetBankAccountsQuery();

  const categories = useMemo(
    () => (Array.isArray(categoriesData) ? categoriesData : []),
    [categoriesData],
  );
  const accounts = useMemo(
    () => (Array.isArray(accountsData) ? accountsData : []),
    [accountsData],
  );
  const operation = operationData ?? null;

  useEffect(() => {
    if (!operation) {
      return;
    }

    setSelectedCategoryId(operation.category_id ?? null);
  }, [operation]);
  const selectedCategory = categories.find(
    (category) => Number(category.id) === Number(selectedCategoryId),
  );
  const account = accounts.find(
    (item) => Number(item.bank_account_id) === Number(operation?.bank_account_id),
  );

  const handleCategoryClose = () => {
    setCategoryAnchorEl(null);
    setSelectedCategoryId(operation?.category_id ?? null);
  };

  const handleCategorySave = async () => {
    if (!operation || selectedCategoryId == null) {
      handleCategoryClose();
      return;
    }

    if (Number(selectedCategoryId) === Number(operation.category_id)) {
      setCategoryAnchorEl(null);
      return;
    }

    setErrorText("");

    try {
      await updateTransactionCategory({
        transactionId: operation.id,
        category_id: Number(selectedCategoryId),
      }).unwrap();
      setCategoryAnchorEl(null);
    } catch {
      setSelectedCategoryId(operation.category_id ?? null);
      setErrorText("Произошла ошибка при изменении категории");
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

  return (
    <div className={styles.root}>
      {errorText && <Alert severity="error">{errorText}</Alert>}

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
            {account?.bank_account_name || "—"}
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
              {selectedCategory?.name || operation.category_name || "—"}
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
