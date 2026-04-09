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
  useGetCategoryImageMappingsQuery,
  useGetMerchantImageMappingsQuery,
} from "services/images/imagesApi";
import {
  useGetAllTransactionsQuery,
  useGetTransactionCategoriesQuery,
  useGetTransactionsQuery,
} from "services/transactions/transactionsApi";
import { formatMoney } from "src/utils/formatMoney";
import AppTextField from "ui/AppTextField";
import OperationListItem from "./OperationListItem";
import {
  buildDonutGradient,
  buildImageMappingLookup,
  filterOperationsByType,
  formatOperationsGroupTitle,
  getCategorySegments,
  getLatestOperationsMonth,
  getOperationsTotal,
} from "utils/operationHelpers";
import {
  OPERATIONS_ANALYTICS_TYPES,
  getOperationsAnalyticsConfig,
} from "./operationsAnalyticsConfig";
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
  const [filters, setFilters] = useState({
    dateFrom: now.startOf("month"),
    dateTo: now.endOf("month"),
    minAmount: "",
    maxAmount: "",
    categoryIds: [],
  });
  const [periodDraft, setPeriodDraft] = useState({
    dateFrom: now.startOf("month"),
    dateTo: now.endOf("month"),
  });
  const [amountDraft, setAmountDraft] = useState({
    minAmount: "",
    maxAmount: "",
  });
  const [categoryDraftIds, setCategoryDraftIds] = useState([]);

  const [periodDialogOpen, setPeriodDialogOpen] = useState(false);
  const [periodTarget, setPeriodTarget] = useState("from");
  const [periodInitialized, setPeriodInitialized] = useState(false);

  const [amountDialogOpen, setAmountDialogOpen] = useState(false);

  const [categoriesDialogOpen, setCategoriesDialogOpen] = useState(false);
  const [categoriesInitialized, setCategoriesInitialized] = useState(false);

  const { data: categoriesData = [] } = useGetTransactionCategoriesQuery();
  const categories = Array.isArray(categoriesData) ? categoriesData : [];
  const { data: merchantImageMappings } = useGetMerchantImageMappingsQuery();
  const { data: categoryImageMappings } = useGetCategoryImageMappingsQuery();
  const merchantImageLookup = useMemo(
    () => buildImageMappingLookup(merchantImageMappings),
    [merchantImageMappings],
  );
  const categoryImageLookup = useMemo(
    () => buildImageMappingLookup(categoryImageMappings),
    [categoryImageMappings],
  );

  useEffect(() => {
    if (categories.length === 0 || categoriesInitialized) {
      return;
    }

    const categoryIds = categories.map((item) => Number(item.id));
    setFilters((prev) => ({
      ...prev,
      categoryIds,
    }));
    setCategoryDraftIds(categoryIds);
    setCategoriesInitialized(true);
  }, [categories, categoriesInitialized]);

  const noSelectedCategories =
    categories.length > 0 && filters.categoryIds.length === 0;

  const {
    data: latestOperationsData,
    isLoading: isLatestOperationsLoading,
    isError: isLatestOperationsError,
  } = useGetTransactionsQuery({
    limit: 1,
    offset: 0,
  });

  const latestMonthDate = useMemo(
    () =>
      getLatestOperationsMonth(
        Array.isArray(latestOperationsData) ? latestOperationsData : [],
      ),
    [latestOperationsData],
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

    if (!Array.isArray(latestOperationsData)) {
      if (isLatestOperationsError) {
        setPeriodInitialized(true);
      }
      return;
    }

    const from = latestMonthDate.startOf("month");
    const to = latestMonthDate.endOf("month");

    setFilters((prev) => ({
      ...prev,
      dateFrom: from,
      dateTo: to,
    }));
    setPeriodDraft({
      dateFrom: from,
      dateTo: to,
    });
    setPeriodInitialized(true);
  }, [latestOperationsData, latestMonthDate, periodInitialized, isLatestOperationsError]);

  const hasCategoryFilter =
    categories.length > 0 && filters.categoryIds.length !== categories.length;

  const transactionsFilters = useMemo(() => {
    const payload = {};

    if (periodInitialized) {
      payload.start_date = filters.dateFrom.startOf("day").toISOString();
      payload.end_date = filters.dateTo.endOf("day").toISOString();
    }

    if (filters.minAmount !== "") {
      payload.min_amount = Number(filters.minAmount);
    }

    if (filters.maxAmount !== "") {
      payload.max_amount = Number(filters.maxAmount);
    }

    if (hasCategoryFilter && filters.categoryIds.length > 0) {
      payload.category_ids = filters.categoryIds;
    }

    return payload;
  }, [
    periodInitialized,
    filters,
    hasCategoryFilter,
  ]);

  const {
    data: filteredOperationsData,
    isLoading: isFilteredLoading,
    isError: isFilteredError,
  } = useGetAllTransactionsQuery(transactionsFilters, {
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

  const analyticsDataByType = useMemo(
    () =>
      OPERATIONS_ANALYTICS_TYPES.reduce((result, type) => {
        const config = getOperationsAnalyticsConfig(type);
        const typeOperations = filterOperationsByType(operations, type);
        const summarySegments = getCategorySegments(typeOperations, type, 3);

        result[type] = {
          title: config.title,
          totalAmount: getOperationsTotal(typeOperations),
          summaryRingBackground: buildDonutGradient(summarySegments),
        };

        return result;
      }, {}),
    [operations],
  );

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

  const summaryCards = useMemo(
    () =>
      OPERATIONS_ANALYTICS_TYPES.map((type) => ({
        type,
        title: analyticsDataByType[type].title,
        totalAmount: analyticsDataByType[type].totalAmount,
        ringBackground: analyticsDataByType[type].summaryRingBackground,
      })),
    [analyticsDataByType],
  );

  const amountFilterActive = filters.minAmount !== "" || filters.maxAmount !== "";
  const categoryFilterActive = hasCategoryFilter;
  const periodFilterActive =
    periodInitialized &&
    (!filters.dateFrom.isSame(defaultPeriodFrom, "day") ||
      !filters.dateTo.isSame(defaultPeriodTo, "day"));
  const periodLabel = getPeriodLabel(filters.dateFrom, filters.dateTo);

  const resetPeriodFilter = useCallback(() => {
    setFilters((prev) => ({
      ...prev,
      dateFrom: defaultPeriodFrom,
      dateTo: defaultPeriodTo,
    }));
    setPeriodDraft({
      dateFrom: defaultPeriodFrom,
      dateTo: defaultPeriodTo,
    });
    setPeriodDialogOpen(false);
  }, [defaultPeriodFrom, defaultPeriodTo]);

  const resetAmountFilter = useCallback(() => {
    setFilters((prev) => ({
      ...prev,
      minAmount: "",
      maxAmount: "",
    }));
    setAmountDraft({
      minAmount: "",
      maxAmount: "",
    });
    setAmountDialogOpen(false);
  }, []);

  const resetCategories = useCallback(() => {
    const categoryIds = categories.map((item) => Number(item.id));
    setFilters((prev) => ({
      ...prev,
      categoryIds,
    }));
    setCategoryDraftIds(categoryIds);
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
    setPeriodDraft({
      dateFrom: filters.dateFrom,
      dateTo: filters.dateTo,
    });
    setPeriodTarget("from");
    setPeriodDialogOpen(true);
  };

  const applyPeriodFilter = () => {
    let from = periodDraft.dateFrom.startOf("day");
    let to = periodDraft.dateTo.endOf("day");

    if (from.isAfter(to)) {
      const tmp = from;
      from = to.startOf("day");
      to = tmp.endOf("day");
    }

    setFilters((prev) => ({
      ...prev,
      dateFrom: from,
      dateTo: to,
    }));
    setPeriodDialogOpen(false);
  };

  const openAmountDialog = () => {
    setAmountDraft({
      minAmount: filters.minAmount,
      maxAmount: filters.maxAmount,
    });
    setAmountDialogOpen(true);
  };

  const applyAmountFilter = () => {
    const minValue =
      amountDraft.minAmount === ""
        ? ""
        : String(Math.max(0, Number(amountDraft.minAmount)));
    const maxValue =
      amountDraft.maxAmount === ""
        ? ""
        : String(Math.max(0, Number(amountDraft.maxAmount)));

    if (minValue !== "" && maxValue !== "" && Number(minValue) > Number(maxValue)) {
      setFilters((prev) => ({
        ...prev,
        minAmount: maxValue,
        maxAmount: minValue,
      }));
    } else {
      setFilters((prev) => ({
        ...prev,
        minAmount: minValue,
        maxAmount: maxValue,
      }));
    }

    setAmountDialogOpen(false);
  };

  const toggleCategory = (categoryId) => {
    const normalizedId = Number(categoryId);

    setCategoryDraftIds((prev) => {
      if (prev.includes(normalizedId)) {
        return prev.filter((item) => item !== normalizedId);
      }

      return [...prev, normalizedId];
    });
  };

  const openCategoriesDialog = () => {
    setCategoryDraftIds([...filters.categoryIds]);
    setCategoriesDialogOpen(true);
  };

  const applyCategoriesFilter = () => {
    setFilters((prev) => ({
      ...prev,
      categoryIds: [...categoryDraftIds],
    }));
    setCategoriesDialogOpen(false);
  };

  const resetCategoryDrafts = () => {
    setCategoryDraftIds(categories.map((item) => Number(item.id)));
  };

  const dialogPaperSx = {
    width: "calc(100% - 72px)",
    maxWidth: "320px",
    margin: 0,
  };

  const renderListContent = () => {
    if (!periodInitialized || isLatestOperationsLoading || isFilteredLoading) {
      return (
        <div className={styles.listState}>
          <CircularProgress size={24} />
        </div>
      );
    }

    if (isLatestOperationsError || isFilteredError) {
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
                  merchantImageLookup={merchantImageLookup}
                  categoryImageLookup={categoryImageLookup}
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
          <span className={styles.filterButtonLabel}>{periodLabel}</span>
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
          onClick={categoryFilterActive ? resetCategories : openCategoriesDialog}
        >
          <span className={styles.filterButtonLabel}>Категория</span>
          {categoryFilterActive ? <CloseIcon /> : <ArrowDropDownIcon />}
        </button>
      </div>

      <div className={styles.summaryRow}>
        {summaryCards.map((card) => {
          return (
            <button
              key={card.type}
              type="button"
              className={`${styles.summaryCard} ${styles.summaryCardButton}`}
              onClick={() =>
                navigate(
                  `/operations/analytics/${card.type}?month=${filters.dateFrom.format("YYYY-MM")}`,
                )
              }
            >
              <div
                className={styles.summaryRing}
                style={{
                  "--ring-background": card.ringBackground,
                }}
              />
              <div className={styles.summaryInfo}>
                <div className={styles.summaryLabel}>{card.title}</div>
                <div className={styles.summaryValue}>
                  {formatMoney(card.totalAmount)} ₽
                </div>
              </div>
            </button>
          );
        })}
      </div>
      <div className={styles.listWrap}>
        {renderListContent()}
      </div>

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
              От: {formatDateForFilterLabel(periodDraft.dateFrom)}
            </button>
            <button
              type="button"
              className={`${styles.rangeFieldButton} ${periodTarget === "to" ? styles.rangeFieldButtonActive : ""}`}
              onClick={() => setPeriodTarget("to")}
            >
              До: {formatDateForFilterLabel(periodDraft.dateTo)}
            </button>
          </div>

          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
            <DateCalendar
              value={periodTarget === "from" ? periodDraft.dateFrom : periodDraft.dateTo}
              onChange={(newValue) => {
                if (!newValue) {
                  return;
                }

                if (periodTarget === "from") {
                  const fromValue = newValue.startOf("day");
                  setPeriodDraft((prev) => ({
                    dateFrom: fromValue,
                    dateTo: fromValue.isAfter(prev.dateTo)
                      ? fromValue.endOf("day")
                      : prev.dateTo,
                  }));
                  setPeriodTarget("to");
                } else {
                  const toValue = newValue.endOf("day");
                  setPeriodDraft((prev) => ({
                    dateTo: toValue,
                    dateFrom: toValue.isBefore(prev.dateFrom)
                      ? toValue.startOf("day")
                      : prev.dateFrom,
                  }));
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
              value={amountDraft.minAmount}
              onChange={(event) =>
                setAmountDraft((prev) => ({
                  minAmount: event.target.value,
                  maxAmount: prev.maxAmount,
                }))
              }
            />
            <AppTextField
              placeholder="До"
              type="number"
              value={amountDraft.maxAmount}
              onChange={(event) =>
                setAmountDraft((prev) => ({
                  minAmount: prev.minAmount,
                  maxAmount: event.target.value,
                }))
              }
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
                <Checkbox
                  checked={categoryDraftIds.includes(Number(category.id))}
                />
              </button>
            ))}

          </div>
        </DialogContent>
        <DialogActions className={styles.dialogActions}>
          <button
            type="button"
            className={styles.dialogActionButton}
            onClick={resetCategoryDrafts}
          >
            Сбросить
          </button>
          <button
            type="button"
            className={styles.dialogActionButton}
            onClick={applyCategoriesFilter}
          >
            ОК
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
