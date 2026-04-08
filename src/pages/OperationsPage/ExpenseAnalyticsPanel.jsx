import { CircularProgress, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import { formatMoney } from "utils/formatMoney";
import { buildDonutGradient } from "utils/operationHelpers";
import styles from "./OperationsPage.module.scss";

function getSegmentPercent(amount, totalAmount) {
  if (!totalAmount) {
    return 0;
  }

  return Math.round((amount / totalAmount) * 100);
}

export default function ExpenseAnalyticsPanel({
  totalAmount,
  periodLabel,
  segments,
  isLoading,
  isError,
  onClose,
}) {
  const donutBackground = buildDonutGradient(segments);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className={styles.analyticsState}>
          <CircularProgress size={24} />
        </div>
      );
    }

    if (isError) {
      return (
        <div className={styles.analyticsState}>
          <Typography variant="body2" color="text.secondary">
            Не удалось загрузить расходы
          </Typography>
        </div>
      );
    }

    if (segments.length === 0) {
      return (
        <div className={styles.analyticsState}>
          <Typography variant="body2" color="text.secondary">
            Нет расходов за выбранный период
          </Typography>
        </div>
      );
    }

    return (
      <div className={styles.analyticsContent}>
        <div className={styles.analyticsDonutWrap}>
          <div
            className={styles.analyticsDonut}
            style={{ "--ring-background": donutBackground }}
          >
            <div className={styles.analyticsDonutCenter}>
              <div className={styles.analyticsDonutLabel}>Расходы</div>
              <div className={styles.analyticsDonutValue}>
                {formatMoney(totalAmount)} ₽
              </div>
            </div>
          </div>
        </div>

        <div className={styles.analyticsLegend}>
          {segments.map((segment) => (
            <div key={segment.label} className={styles.analyticsLegendItem}>
              <div className={styles.analyticsLegendItemLabelWrap}>
                <span
                  className={styles.analyticsLegendItemColor}
                  style={{ backgroundColor: segment.color }}
                />
                <span className={styles.analyticsLegendItemLabel}>
                  {segment.label}
                </span>
              </div>

              <div className={styles.analyticsLegendItemMeta}>
                <span className={styles.analyticsLegendItemValue}>
                  {formatMoney(segment.amount)} ₽
                </span>
                <span className={styles.analyticsLegendItemPercent}>
                  {getSegmentPercent(segment.amount, totalAmount)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.analyticsCard}>
      <div className={styles.analyticsHeader}>
        <div>
          <Typography variant="h6" className={styles.analyticsTitle}>
            Расходы
          </Typography>
          <Typography variant="body2" className={styles.analyticsSubtitle}>
            {periodLabel}
          </Typography>
        </div>

        <button
          type="button"
          className={styles.analyticsCloseButton}
          onClick={onClose}
        >
          <CloseIcon fontSize="small" />
          <span>Скрыть</span>
        </button>
      </div>

      {renderContent()}
    </div>
  );
}
