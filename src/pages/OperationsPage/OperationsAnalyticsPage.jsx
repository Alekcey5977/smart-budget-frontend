import { Alert, CircularProgress } from "@mui/material";
import dayjs from "dayjs";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Navigate, useParams, useSearchParams } from "react-router-dom";
import {
  useGetAllTransactionsQuery,
  useGetTransactionsQuery,
} from "services/transactions/transactionsApi";
import {
  filterOperationsByType,
  getCategorySegments,
  getLatestOperationsMonth,
  getMonthLabel,
  getOperationsTotal,
} from "utils/operationHelpers";
import OperationsAnalyticsPanel from "./OperationsAnalyticsPanel";
import { getOperationsAnalyticsConfig } from "./operationsAnalyticsConfig";
import styles from "./OperationsAnalyticsPage.module.scss";

function getInitialMonth(searchParams) {
  const value = searchParams.get("month");

  if (!value || !/^\d{4}-\d{2}$/.test(value)) {
    return null;
  }

  const monthDate = dayjs(`${value}-01`);
  return monthDate.isValid() ? monthDate.startOf("month") : null;
}

export default function OperationsAnalyticsPage() {
  const { type } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const config = getOperationsAnalyticsConfig(type);
  const initialMonth = useMemo(
    () => getInitialMonth(searchParams),
    [searchParams],
  );
  const [monthInitialized, setMonthInitialized] = useState(Boolean(initialMonth));
  const [monthDate, setMonthDate] = useState(
    () => initialMonth || dayjs().startOf("month"),
  );

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

  useEffect(() => {
    if (monthInitialized) {
      return;
    }

    if (!Array.isArray(latestOperationsData)) {
      if (isLatestOperationsError) {
        setMonthInitialized(true);
      }
      return;
    }

    setMonthDate(latestMonthDate.startOf("month"));
    setMonthInitialized(true);
  }, [
    latestOperationsData,
    latestMonthDate,
    monthInitialized,
    isLatestOperationsError,
  ]);

  const monthFilters = useMemo(
    () => ({
      start_date: monthDate.startOf("month").toISOString(),
      end_date: monthDate.endOf("month").toISOString(),
    }),
    [monthDate],
  );

  const {
    data: monthOperationsData,
    isLoading: isMonthOperationsLoading,
    isError: isMonthOperationsError,
  } = useGetAllTransactionsQuery(monthFilters, {
    skip: !monthInitialized,
  });

  const operations = useMemo(
    () => (Array.isArray(monthOperationsData) ? monthOperationsData : []),
    [monthOperationsData],
  );

  const analyticsOperations = useMemo(
    () => filterOperationsByType(operations, type),
    [operations, type],
  );

  const segments = useMemo(
    () => getCategorySegments(analyticsOperations, type, 6),
    [analyticsOperations, type],
  );

  const totalAmount = useMemo(
    () => getOperationsTotal(analyticsOperations),
    [analyticsOperations],
  );

  const monthLabel = useMemo(() => getMonthLabel(monthDate), [monthDate]);
  const canGoNext = useMemo(
    () => monthDate.isBefore(latestMonthDate, "month"),
    [monthDate, latestMonthDate],
  );

  useEffect(() => {
    if (!monthInitialized) {
      return;
    }

    const nextMonthValue = monthDate.format("YYYY-MM");

    if (searchParams.get("month") === nextMonthValue) {
      return;
    }

    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.set("month", nextMonthValue);
    setSearchParams(nextSearchParams, { replace: true });
  }, [monthDate, monthInitialized, searchParams, setSearchParams]);

  const showPreviousMonth = useCallback(() => {
    setMonthDate((prev) => prev.subtract(1, "month"));
  }, []);

  const showNextMonth = useCallback(() => {
    if (!canGoNext) {
      return;
    }

    setMonthDate((prev) => prev.add(1, "month"));
  }, [canGoNext]);

  if (!config) {
    return <Navigate to="/operations" replace />;
  }

  if (!monthInitialized && isLatestOperationsError) {
    return (
      <div className={styles.state}>
        <Alert severity="error" className={styles.alert}>
          {config.errorText}
        </Alert>
      </div>
    );
  }

  if (!monthInitialized && isLatestOperationsLoading) {
    return (
      <div className={styles.state}>
        <CircularProgress size={24} />
      </div>
    );
  }

  return (
    <div className={styles.root}>
      <OperationsAnalyticsPanel
        title={config.title}
        totalAmount={totalAmount}
        monthLabel={monthLabel}
        segments={segments}
        isLoading={!monthInitialized || isMonthOperationsLoading}
        isError={isMonthOperationsError}
        errorText={config.errorText}
        emptyText={config.emptyText}
        canGoNext={canGoNext}
        onPrevMonth={showPreviousMonth}
        onNextMonth={showNextMonth}
      />
    </div>
  );
}
