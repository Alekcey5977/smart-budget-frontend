import {
  Alert,
  CircularProgress,
  IconButton,
  Popover,
  Typography,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { type MouseEvent, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import { useGetBankAccountsQuery } from "services/auth/bankApi";
import {
  useGetCategoryImageMappingsQuery,
  useGetMerchantImageMappingsQuery,
} from "services/images/imagesApi";
import {
  useGetTransactionCategoriesQuery,
  useGetTransactionByIdQuery,
  useUpdateTransactionCategoryMutation,
} from "services/transactions/transactionsApi";
import OperationIcon from "ui/OperationIcon";
import { formatCurrency } from "utils/formatMoney";
import {
  buildImageMappingLookup,
  formatOperationDateTime,
  getOperationSignedAmount,
  getOperationTitle,
  isIncomeOperation,
} from "utils/operationHelpers";
import styles from "./OperationDetailsPage.module.scss";

type OperationType = "income" | "expense";

type Operation = {
  id: string;
  bank_account_id: number;
  category_id: number | null;
  category_name?: string | null;
  merchant_id?: number | null;
  merchant_name?: string | null;
  amount: number;
  created_at: string;
  type: OperationType;
  description?: string | null;
};

type Category = {
  id: number;
  name: string;
  type: OperationType | null;
};

type BankAccount = {
  bank_account_id: number;
  bank_account_name?: string | null;
  balance: number | string;
};

export default function OperationDetailsPage() {
  const { operationId } = useParams();
  const [categoryAnchorEl, setCategoryAnchorEl] = useState<HTMLElement | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [errorText, setErrorText] = useState("");
  const categoryDialogOpen = Boolean(categoryAnchorEl);
  const [updateTransactionCategory, { isLoading: isUpdatingCategory }] =
    useUpdateTransactionCategoryMutation();

  const { data: operationData, isLoading, isError } =
    useGetTransactionByIdQuery(operationId, {
      skip: !operationId,
    });
  const operation = (operationData ?? null) as Operation | null;
  const operationType = operation?.type;
  const { currentData: categoriesData } = useGetTransactionCategoriesQuery(
    { type: operationType },
    {
      skip: !operationType,
    },
  );
  const { data: accountsData } = useGetBankAccountsQuery(undefined);
  const { data: merchantImageMappings } =
    useGetMerchantImageMappingsQuery(undefined);
  const { data: categoryImageMappings } =
    useGetCategoryImageMappingsQuery(undefined);

  const categories = useMemo(
    () => (Array.isArray(categoriesData) ? (categoriesData as Category[]) : []),
    [categoriesData],
  );
  const accounts = useMemo(
    () => (Array.isArray(accountsData) ? (accountsData as BankAccount[]) : []),
    [accountsData],
  );
  const merchantImageLookup = useMemo(
    () => buildImageMappingLookup(merchantImageMappings),
    [merchantImageMappings],
  );
  const categoryImageLookup = useMemo(
    () => buildImageMappingLookup(categoryImageMappings),
    [categoryImageMappings],
  );
  const visibleCategories = useMemo(() => {
    if (!operationType) {
      return categories;
    }

    return categories.filter(
      (category) => category?.type == null || category.type === operationType,
    );
  }, [categories, operationType]);

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

  const handleCategoryOpen = (event: MouseEvent<HTMLButtonElement>) => {
    setCategoryAnchorEl(event.currentTarget);
  };

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
        <OperationIcon
          operation={operation}
          merchantImageLookup={merchantImageLookup}
          categoryImageLookup={categoryImageLookup}
          className={styles.operationCircle}
        />

        <Typography variant="h6" className={styles.operationTitle}>
          {getOperationTitle(operation)}
        </Typography>

        <div
          className={
            isIncomeOperation(operation)
              ? styles.amountIncome
              : styles.amountExpense
          }
        >
          <Typography variant="h5" className={styles.amountValue}>
            {getOperationSignedAmount(operation)}
          </Typography>
        </div>
      </div>

      <div className={styles.detailsCard}>
        <div className={styles.detailsTitle}>Подробности</div>

        <div className={styles.detailsList}>
          <div className={styles.detailRow}>
            <div className={styles.detailLabel}>Баланс</div>
            <div className={styles.detailValue}>
              {account ? formatCurrency(account.balance) : "—"}
            </div>
          </div>

          <div className={styles.detailRow}>
            <div className={styles.detailLabel}>Карта списания</div>
            <div className={styles.detailValue}>
              {account?.bank_account_name || "—"}
            </div>
          </div>

          <div className={styles.detailRow}>
            <div className={styles.detailLabel}>Дата и время</div>
            <div className={styles.detailValue}>
              {formatOperationDateTime(operation.created_at)}
            </div>
          </div>

          <div className={`${styles.detailRow} ${styles.categoryRow}`}>
            <div className={styles.detailLabel}>Категория</div>
            <div className={styles.categoryValue}>
              <span className={styles.detailValue}>
                {selectedCategory?.name || operation.category_name || "—"}
              </span>

              <IconButton
                aria-label="Изменить категорию"
                disabled={isUpdatingCategory}
                onClick={handleCategoryOpen}
                className={styles.categoryEditButton}
              >
                <EditOutlinedIcon fontSize="small" />
              </IconButton>
            </div>
          </div>
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
          {visibleCategories.map((category) => (
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
