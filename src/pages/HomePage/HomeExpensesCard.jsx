import { CircularProgress, Paper, Typography } from "@mui/material";
import dayjs from "dayjs";
import "dayjs/locale/ru";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

import {
  useGetAllTransactionsQuery,
  useGetTransactionsQuery,
} from "services/transactions/transactionsApi";
import {
  buildDonutGradient,
  getExpenseCategorySegments,
  getLatestOperationsMonth,
  isIncomeOperation,
} from "utils/operationHelpers";
import styles from "./HomePage.module.scss";

dayjs.locale("ru");

function getMonthLabel(value) {
  const label = value.format("MMMM");
  return label.charAt(0).toUpperCase() + label.slice(1);
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
      start_date: currentMonthDate.startOf("month").toISOString(),
      end_date: currentMonthDate.endOf("month").toISOString(),
    }),
    [currentMonthDate],
  );

  const {
    data: monthOperationsData,
    isLoading: isMonthOperationsLoading,
    isError: isMonthOperationsError,
  } = useGetAllTransactionsQuery(monthFilters);

  const operations = Array.isArray(monthOperationsData) ? monthOperationsData : [];

  const monthExpenses = useMemo(
    () => operations.filter((operation) => !isIncomeOperation(operation)),
    [operations],
  );

  const isLoading = isLatestOperationsLoading || isMonthOperationsLoading;
  const isError = isLatestOperationsError || isMonthOperationsError;

  const segments = useMemo(
    () => getExpenseCategorySegments(monthExpenses, 3),
    [monthExpenses],
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
          {isLoading ? (
            <div className={styles.expensesLoading}>
              <CircularProgress size={18} />
            </div>
          ) : isError ? (
            <Typography variant="body2" color="text.secondary">
              Ошибка данных
            </Typography>
          ) : segments.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              Расходов нет
            </Typography>
          ) : (
            segments.map((segment) => (
              <div key={segment.label} className={styles.expensesLegendItem}>
                <span
                  className={styles.expensesLegendColor}
                  style={{ backgroundColor: segment.color }}
                />
                <span className={styles.expensesLegendText}>{segment.label}</span>
              </div>
            ))
          )}
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
