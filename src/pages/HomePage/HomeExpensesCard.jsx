import { CircularProgress, Paper, Typography } from "@mui/material";
import dayjs from "dayjs";
import "dayjs/locale/ru";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

import {
  useGetTransactionCategoriesSummaryQuery,
  useGetTransactionsQuery,
} from "services/transactions/transactionsApi";
import {
  buildDonutGradient,
  getExpenseCategorySummarySegments,
  getLatestOperationsMonth,
} from "utils/operationHelpers";
import styles from "./HomePage.module.scss";

dayjs.locale("ru");

function getMonthLabel(value) {
  const label = value.format("MMMM");
  return label.charAt(0).toUpperCase() + label.slice(1);
}

function HomeExpensesLegend({ isLoading, isError, segments }) {
  if (isLoading) {
    return (
      <div className={styles.expensesLoading}>
        <CircularProgress size={18} />
      </div>
    );
  }

  if (isError) {
    return (
      <Typography variant="body2" color="text.secondary">
        Ошибка данных
      </Typography>
    );
  }

  if (segments.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        Расходов нет
      </Typography>
    );
  }

  return segments.map((segment) => (
    <div key={segment.label} className={styles.expensesLegendItem}>
      <span
        className={styles.expensesLegendColor}
        style={{ backgroundColor: segment.color }}
      />
      <span className={styles.expensesLegendText}>{segment.label}</span>
    </div>
  ));
}

export default function HomeExpensesCard() {
  const navigate = useNavigate();

  const {
    data: latestOperationsData,
    isLoading: isLatestOperationsLoading,
    isError: isLatestOperationsError,
  } = useGetTransactionsQuery({
    limit: 1,
    offset: 0,
  });

  const currentMonthDate = useMemo(
    () =>
      getLatestOperationsMonth(
        Array.isArray(latestOperationsData) ? latestOperationsData : [],
      ),
    [latestOperationsData],
  );

  const monthFilters = useMemo(
    () => ({
      transaction_type: "expense",
      start_date: currentMonthDate.startOf("month").toISOString(),
      end_date: currentMonthDate.endOf("month").toISOString(),
    }),
    [currentMonthDate],
  );

  const {
    data: categorySummaryData,
    isLoading: isCategorySummaryLoading,
    isError: isCategorySummaryError,
  } = useGetTransactionCategoriesSummaryQuery(monthFilters);

  const isLoading = isLatestOperationsLoading || isCategorySummaryLoading;
  const isError = isLatestOperationsError || isCategorySummaryError;

  const segments = useMemo(
    () => getExpenseCategorySummarySegments(categorySummaryData, 3),
    [categorySummaryData],
  );

  const donutBackground = useMemo(
    () => buildDonutGradient(segments),
    [segments],
  );

  return (
    <Paper
      variant="outlined"
      className={`${styles.card} ${styles.cardLink}`}
      onClick={() => navigate("/operations")}
    >
      <Typography variant="subtitle1" fontWeight={700}>
        Расходы за {getMonthLabel(currentMonthDate)}
      </Typography>

      <div className={styles.expensesCardContent}>
        <div className={styles.expensesLegend}>
          <HomeExpensesLegend
            isLoading={isLoading}
            isError={isError}
            segments={segments}
          />
        </div>

        <div className={styles.donutWrap}>
          <div
            className={styles.expenseDonut}
            style={{ "--ring-background": donutBackground }}
          />
        </div>
      </div>
    </Paper>
  );
}
