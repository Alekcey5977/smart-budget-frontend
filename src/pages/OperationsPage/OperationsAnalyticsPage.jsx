import { CircularProgress } from "@mui/material";
import dayjs from "dayjs";
import { useCallback, useEffect, useMemo } from "react";
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

function getMonthFromSearchParams(searchParams) {
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
  const monthFromSearchParams = useMemo(
    () => getMonthFromSearchParams(searchParams),
    [searchParams],
  );

  const {
    data: latestOperationsData,
    isLoading: isLatestOperationsLoading,
  } = useGetTransactionsQuery(
    {
      limit: 1,
      offset: 0,
    },
    {
      skip: !config,
    },
  );

  const latestMonthDate = useMemo(
    () =>
      getLatestOperationsMonth(
        Array.isArray(latestOperationsData) ? latestOperationsData : [],
      ),
    [latestOperationsData],
  );

  const monthDate = useMemo(
    () => monthFromSearchParams || latestMonthDate.startOf("month"),
    [monthFromSearchParams, latestMonthDate],
  );

  const isWaitingLatestMonth = !monthFromSearchParams && isLatestOperationsLoading;

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
    skip: !config || isWaitingLatestMonth,
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

  const setMonthSearchParam = useCallback((nextMonthDate, options) => {
    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.set("month", nextMonthDate.format("YYYY-MM"));
    setSearchParams(nextSearchParams, options);
  }, [
    searchParams,
    setSearchParams,
  ]);

  useEffect(() => {
    if (monthFromSearchParams || isLatestOperationsLoading) {
      return;
    }

    setMonthSearchParam(monthDate, { replace: true });
  }, [
    monthDate,
    monthFromSearchParams,
    isLatestOperationsLoading,
    setMonthSearchParam,
  ]);

  const showPreviousMonth = useCallback(() => {
    setMonthSearchParam(monthDate.subtract(1, "month"));
  }, [monthDate, setMonthSearchParam]);

  const showNextMonth = useCallback(() => {
    if (!canGoNext) {
      return;
    }

    setMonthSearchParam(monthDate.add(1, "month"));
  }, [canGoNext, monthDate, setMonthSearchParam]);

  if (!config) {
    return <Navigate to="/operations" replace />;
  }

  if (isWaitingLatestMonth) {
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
        isLoading={isWaitingLatestMonth || isMonthOperationsLoading}
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
