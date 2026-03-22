import {
  Alert,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import CloseIcon from "@mui/icons-material/Close";
import FilterAltOffOutlinedIcon from "@mui/icons-material/FilterAltOffOutlined";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar, LocalizationProvider } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

import {
  useGetTransactionCategoriesQuery,
  useGetTransactionsQuery,
} from "services/transactions/transactionsApi";
import { formatMoney } from "src/utils/formatMoney";
import AppTextField from "ui/AppTextField";
import OperationListItem from "./OperationListItem";
import {
  buildDonutGradient,
  formatOperationsGroupTitle,
  getExpenseCategorySegments,
  getLatestOperationsMonth,
  isIncomeOperation,
} from "utils/operationHelpers";
import styles from "./OperationsPage.module.scss";

function formatDateForFilterLabel(value) {
  if (!value || !value.isValid()) {
    return "";
  }
  return value.format("D MMM");
}

function getPeriodLabel(from, to) {
  if (!from || !to || !from.isValid() || !to.isValid()) {
    return "Период";
  }

  if (from.date() === 1 && to.isSame(from.endOf("month"), "day")) {
    const label = from.format("MMMM");
    return label.charAt(0).toUpperCase() + label.slice(1);
  }

  return `${formatDateForFilterLabel(from)} - ${formatDateForFilterLabel(to)}`;
}

export default function OperationsPage() {
  const navigate = useNavigate();
  const { setPageHeaderAction } = useOutletContext() || {};

  const now = dayjs();
  const [dateFrom, setDateFrom] = useState(now.startOf("month"));
  const [dateTo, setDateTo] = useState(now.endOf("month"));

  const [periodDialogOpen, setPeriodDialogOpen] = useState(false);
  const [periodDraftFrom, setPeriodDraftFrom] = useState(now.startOf("month"));
  const [periodDraftTo, setPeriodDraftTo] = useState(now.endOf("month"));
  const [periodTarget, setPeriodTarget] = useState("from");
  const [periodInitialized, setPeriodInitialized] = useState(false);

  const [amountDialogOpen, setAmountDialogOpen] = useState(false);
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [minDraft, setMinDraft] = useState("");
  const [maxDraft, setMaxDraft] = useState("");

  const [categoriesDialogOpen, setCategoriesDialogOpen] = useState(false);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
  const [categoriesInitialized, setCategoriesInitialized] = useState(false);

  const { data: categoriesData = [] } = useGetTransactionCategoriesQuery();
  const categories = Array.isArray(categoriesData) ? categoriesData : [];

  useEffect(() => {
    if (categories.length === 0 || categoriesInitialized) {
      return;
    }

    setSelectedCategoryIds(categories.map((item) => Number(item.id)));
    setCategoriesInitialized(true);
  }, [categories, categoriesInitialized]);

  const noSelectedCategories =
    categories.length > 0 && selectedCategoryIds.length === 0;

  const {
    data: bootstrapOperationsData,
    isLoading: isBootstrapLoading,
    isError: isBootstrapError,
  } = useGetTransactionsQuery({
    limit: 1,
    offset: 0,
  });

  const latestMonthDate = useMemo(
    () =>
      getLatestOperationsMonth(
        Array.isArray(bootstrapOperationsData) ? bootstrapOperationsData : [],
      ),
    [bootstrapOperationsData],
  );

  const defaultPeriodFrom = useMemo(
    () => latestMonthDate.startOf("month"),
    [latestMonthDate],
  );
  const defaultPeriodTo = useMemo(
    () => latestMonthDate.endOf("month"),
    [latestMonthDate],
  );

  useEffect(() => {
    if (periodInitialized) {
      return;
    }

    if (!Array.isArray(bootstrapOperationsData)) {
      if (isBootstrapError) {
        setPeriodInitialized(true);
      }
      return;
    }

    const from = latestMonthDate.startOf("month");
    const to = latestMonthDate.endOf("month");

    setDateFrom(from);
    setDateTo(to);
    setPeriodDraftFrom(from);
    setPeriodDraftTo(to);
    setPeriodInitialized(true);
  }, [bootstrapOperationsData, latestMonthDate, periodInitialized, isBootstrapError]);

  const hasCategoryFilter =
    categories.length > 0 && selectedCategoryIds.length !== categories.length;

  const transactionsFilters = useMemo(() => {
    const payload = {
      limit: 100,
      offset: 0,
    };

    if (periodInitialized) {
      payload.start_date = dateFrom.startOf("day").toISOString();
      payload.end_date = dateTo.endOf("day").toISOString();
    }

    if (minAmount !== "") {
      payload.min_amount = Number(minAmount);
    }

    if (maxAmount !== "") {
      payload.max_amount = Number(maxAmount);
    }

    if (hasCategoryFilter && selectedCategoryIds.length > 0) {
      payload.category_ids = selectedCategoryIds;
    }

    return payload;
  }, [
    periodInitialized,
    dateFrom,
    dateTo,
    minAmount,
    maxAmount,
    hasCategoryFilter,
    selectedCategoryIds,
  ]);

  const {
    data: filteredOperationsData,
    isLoading: isFilteredLoading,
    isError: isFilteredError,
  } = useGetTransactionsQuery(transactionsFilters, {
    skip: !periodInitialized || noSelectedCategories,
  });

  const operations = useMemo(() => {
    if (noSelectedCategories) {
      return [];
    }

    if (!Array.isArray(filteredOperationsData)) {
      return [];
    }

    return filteredOperationsData;
  }, [filteredOperationsData, noSelectedCategories]);

  const groupedOperations = useMemo(() => {
    const map = {};
    const groups = [];

    operations.forEach((operation) => {
      const key = dayjs(operation.created_at).format("YYYY-MM-DD");

      if (!map[key]) {
        map[key] = {
          key,
          title: formatOperationsGroupTitle(operation.created_at),
          items: [],
        };
        groups.push(map[key]);
      }

      map[key].items.push(operation);
    });

    return groups;
  }, [operations]);

  const incomeTotal = useMemo(() => {
    let total = 0;

    operations.forEach((operation) => {
      if (isIncomeOperation(operation)) {
        total += Math.abs(Number(operation.amount || 0));
      }
    });

    return total;
  }, [operations]);

  const expenseTotal = useMemo(() => {
    let total = 0;

    operations.forEach((operation) => {
      if (!isIncomeOperation(operation)) {
        total += Math.abs(Number(operation.amount || 0));
      }
    });

    return total;
  }, [operations]);

  const expenseSegments = useMemo(
    () => getExpenseCategorySegments(operations, 3),
    [operations],
  );

  const expenseRingBackground = useMemo(
    () => buildDonutGradient(expenseSegments),
    [expenseSegments],
  );

  const incomeRingBackground = useMemo(() => {
    if (incomeTotal <= 0) {
      return buildDonutGradient([]);
    }

    return buildDonutGradient([
      {
        amount: incomeTotal,
        color: "#2abf56",
      },
    ]);
  }, [incomeTotal]);

  const amountFilterActive = minAmount !== "" || maxAmount !== "";
  const categoryFilterActive = hasCategoryFilter;
  const periodFilterActive =
    periodInitialized &&
    (!dateFrom.isSame(defaultPeriodFrom, "day") ||
      !dateTo.isSame(defaultPeriodTo, "day"));

  const resetPeriodFilter = useCallback(() => {
    setDateFrom(defaultPeriodFrom);
    setDateTo(defaultPeriodTo);
    setPeriodDraftFrom(defaultPeriodFrom);
    setPeriodDraftTo(defaultPeriodTo);
    setPeriodDialogOpen(false);
  }, [defaultPeriodFrom, defaultPeriodTo]);

  const resetAmountFilter = useCallback(() => {
    setMinDraft("");
    setMaxDraft("");
    setMinAmount("");
    setMaxAmount("");
    setAmountDialogOpen(false);
  }, []);

  const resetCategories = useCallback(() => {
    setSelectedCategoryIds(categories.map((item) => Number(item.id)));
  }, [categories]);

  const resetAllFilters = useCallback(() => {
    resetPeriodFilter();
    resetAmountFilter();
    resetCategories();
  }, [resetPeriodFilter, resetAmountFilter, resetCategories]);

  useEffect(() => {
    if (!setPageHeaderAction) {
      return undefined;
    }

    if (!periodFilterActive && !amountFilterActive && !categoryFilterActive) {
      setPageHeaderAction(null);
      return () => {
        setPageHeaderAction(null);
      };
    }

    setPageHeaderAction(
      <IconButton
        aria-label="Сбросить фильтры"
        onClick={resetAllFilters}
        sx={{
          width: 47,
          height: 37,
          borderRadius: "15px",
          bgcolor: "primary.main",
          color: "text.primary",
          "&:hover": { bgcolor: "primary.main" },
        }}
      >
        <FilterAltOffOutlinedIcon fontSize="small" />
      </IconButton>,
    );

    return () => {
      setPageHeaderAction(null);
    };
  }, [
    setPageHeaderAction,
    periodFilterActive,
    amountFilterActive,
    categoryFilterActive,
    resetAllFilters,
  ]);

  const openPeriodDialog = () => {
    setPeriodDraftFrom(dateFrom);
    setPeriodDraftTo(dateTo);
    setPeriodTarget("from");
    setPeriodDialogOpen(true);
  };

  const applyPeriodFilter = () => {
    let from = periodDraftFrom.startOf("day");
    let to = periodDraftTo.endOf("day");

    if (from.isAfter(to)) {
      const tmp = from;
      from = to.startOf("day");
      to = tmp.endOf("day");
    }

    setDateFrom(from);
    setDateTo(to);
    setPeriodDialogOpen(false);
  };

  const openAmountDialog = () => {
    setMinDraft(minAmount);
    setMaxDraft(maxAmount);
    setAmountDialogOpen(true);
  };

  const applyAmountFilter = () => {
    const minValue = minDraft === "" ? "" : String(Math.max(0, Number(minDraft)));
    const maxValue = maxDraft === "" ? "" : String(Math.max(0, Number(maxDraft)));

    if (minValue !== "" && maxValue !== "" && Number(minValue) > Number(maxValue)) {
      setMinAmount(maxValue);
      setMaxAmount(minValue);
    } else {
      setMinAmount(minValue);
      setMaxAmount(maxValue);
    }

    setAmountDialogOpen(false);
  };

  const toggleCategory = (categoryId) => {
    const normalizedId = Number(categoryId);

    setSelectedCategoryIds((prev) => {
      if (prev.includes(normalizedId)) {
        return prev.filter((item) => item !== normalizedId);
      }

      return [...prev, normalizedId];
    });
  };

  const dialogPaperSx = {
    width: "calc(100% - 72px)",
    maxWidth: "320px",
    margin: 0,
  };

  const renderListContent = () => {
    if (!periodInitialized || isBootstrapLoading || isFilteredLoading) {
      return (
        <div className={styles.listState}>
          <CircularProgress size={24} />
        </div>
      );
    }

    if (isBootstrapError || isFilteredError) {
      return (
        <div className={styles.listState}>
          <Alert severity="error" className={styles.alert}>
            Не удалось загрузить операции
          </Alert>
        </div>
      );
    }

    if (groupedOperations.length === 0) {
      return (
        <div className={styles.listState}>
          <Typography variant="body2" color="text.secondary">
            Операций нет
          </Typography>
        </div>
      );
    }

    return (
      <div className={styles.groups}>
        {groupedOperations.map((group) => (
          <div key={group.key}>
            <Typography variant="subtitle1" className={styles.groupTitle}>
              {group.title}
            </Typography>

            <div className={styles.groupList}>
              {group.items.map((operation) => (
                <OperationListItem
                  key={operation.id}
                  operation={operation}
                  onOpen={(id) => navigate(`/operations/${id}`)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={styles.root}>
      <div className={styles.filtersRow}>
        <button
          type="button"
          className={styles.filterButton}
          onClick={periodFilterActive ? resetPeriodFilter : openPeriodDialog}
        >
          <span className={styles.filterButtonLabel}>
            {getPeriodLabel(dateFrom, dateTo)}
          </span>
          {periodFilterActive ? <CloseIcon /> : <ArrowDropDownIcon />}
        </button>

        <button
          type="button"
          className={styles.filterButton}
          onClick={amountFilterActive ? resetAmountFilter : openAmountDialog}
        >
          <span className={styles.filterButtonLabel}>Сумма</span>
          {amountFilterActive ? <CloseIcon /> : <ArrowDropDownIcon />}
        </button>

        <button
          type="button"
          className={styles.filterButton}
          onClick={categoryFilterActive ? resetCategories : () => setCategoriesDialogOpen(true)}
        >
          <span className={styles.filterButtonLabel}>Категория</span>
          {categoryFilterActive ? <CloseIcon /> : <ArrowDropDownIcon />}
        </button>
      </div>

      <div className={styles.summaryRow}>
        <div className={styles.summaryCard}>
          <div
            className={styles.summaryRing}
            style={{
              "--ring-background": expenseRingBackground,
            }}
          />
          <div className={styles.summaryInfo}>
            <div className={styles.summaryLabel}>Расходы</div>
            <div className={styles.summaryValue}>{formatMoney(expenseTotal)} ₽</div>
          </div>
        </div>

        <div className={styles.summaryCard}>
          <div
            className={styles.summaryRing}
            style={{
              "--ring-background": incomeRingBackground,
            }}
          />
          <div className={styles.summaryInfo}>
            <div className={styles.summaryLabel}>Доходы</div>
            <div className={styles.summaryValue}>{formatMoney(incomeTotal)} ₽</div>
          </div>
        </div>
      </div>

      <div className={styles.listWrap}>{renderListContent()}</div>

      <Dialog
        open={periodDialogOpen}
        onClose={() => setPeriodDialogOpen(false)}
        PaperProps={{ className: styles.dialogPaper, sx: dialogPaperSx }}
      >
        <DialogTitle>Период</DialogTitle>
        <DialogContent className={styles.monthDialogContent}>
          <div className={styles.rangePickerHeader}>
            <button
              type="button"
              className={`${styles.rangeFieldButton} ${periodTarget === "from" ? styles.rangeFieldButtonActive : ""}`}
              onClick={() => setPeriodTarget("from")}
            >
              От: {formatDateForFilterLabel(periodDraftFrom)}
            </button>
            <button
              type="button"
              className={`${styles.rangeFieldButton} ${periodTarget === "to" ? styles.rangeFieldButtonActive : ""}`}
              onClick={() => setPeriodTarget("to")}
            >
              До: {formatDateForFilterLabel(periodDraftTo)}
            </button>
          </div>

          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
            <DateCalendar
              value={periodTarget === "from" ? periodDraftFrom : periodDraftTo}
              onChange={(newValue) => {
                if (!newValue) {
                  return;
                }

                if (periodTarget === "from") {
                  const fromValue = newValue.startOf("day");
                  setPeriodDraftFrom(fromValue);
                  if (fromValue.isAfter(periodDraftTo)) {
                    setPeriodDraftTo(fromValue.endOf("day"));
                  }
                  setPeriodTarget("to");
                } else {
                  const toValue = newValue.endOf("day");
                  setPeriodDraftTo(toValue);
                  if (toValue.isBefore(periodDraftFrom)) {
                    setPeriodDraftFrom(toValue.startOf("day"));
                  }
                }
              }}
              className={styles.monthCalendar}
            />
          </LocalizationProvider>
        </DialogContent>
        <DialogActions className={styles.dialogActions}>
          <button
            type="button"
            className={styles.dialogActionButton}
            onClick={resetPeriodFilter}
          >
            Сбросить
          </button>
          <button
            type="button"
            className={styles.dialogActionButton}
            onClick={() => setPeriodDialogOpen(false)}
          >
            Отмена
          </button>
          <button
            type="button"
            className={styles.dialogActionButton}
            onClick={applyPeriodFilter}
          >
            ОК
          </button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={amountDialogOpen}
        onClose={() => setAmountDialogOpen(false)}
        PaperProps={{ className: styles.dialogPaper, sx: dialogPaperSx }}
      >
        <DialogTitle>Сумма</DialogTitle>
        <DialogContent>
          <div className={styles.amountFields}>
            <AppTextField
              placeholder="От"
              type="number"
              value={minDraft}
              onChange={(event) => setMinDraft(event.target.value)}
            />
            <AppTextField
              placeholder="До"
              type="number"
              value={maxDraft}
              onChange={(event) => setMaxDraft(event.target.value)}
            />
          </div>
        </DialogContent>
        <DialogActions className={styles.dialogActions}>
          <button
            type="button"
            className={styles.dialogActionButton}
            onClick={resetAmountFilter}
          >
            Сбросить
          </button>
          <button
            type="button"
            className={styles.dialogActionButton}
            onClick={applyAmountFilter}
          >
            Применить
          </button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={categoriesDialogOpen}
        onClose={() => setCategoriesDialogOpen(false)}
        PaperProps={{ className: styles.dialogPaper, sx: dialogPaperSx }}
      >
        <DialogTitle>Категории</DialogTitle>
        <DialogContent>
          <div className={styles.categoryList}>
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                className={styles.categoryItem}
                onClick={() => toggleCategory(category.id)}
              >
                {category.name}
                <Checkbox checked={selectedCategoryIds.includes(Number(category.id))} />
              </button>
            ))}

          </div>
        </DialogContent>
        <DialogActions className={styles.dialogActions}>
          <button
            type="button"
            className={styles.dialogActionButton}
            onClick={resetCategories}
          >
            Сбросить
          </button>
          <button
            type="button"
            className={styles.dialogActionButton}
            onClick={() => setCategoriesDialogOpen(false)}
          >
            ОК
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
