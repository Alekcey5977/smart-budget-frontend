import { CircularProgress, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

import { formatCurrency } from "utils/formatMoney";
import { buildDonutGradient } from "utils/operationHelpers";
import styles from "./OperationsAnalyticsPanel.module.scss";

function getSegmentPercent(amount, totalAmount) {
  if (!totalAmount) {
    return 0;
  }

  return Math.round((amount / totalAmount) * 100);
}

export default function OperationsAnalyticsPanel({
  totalAmount,
  monthLabel,
  segments,
  isLoading,
  isError,
  errorText,
  emptyText,
  canGoNext,
  onPrevMonth,
  onNextMonth,
  onClose,
  onSegmentClick,
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
            {errorText}
          </Typography>
        </div>
      );
    }

    if (segments.length === 0) {
      return (
        <div className={styles.analyticsState}>
          <Typography color="text.secondary" sx={{ fontSize: "14px", fontWeight: 700 }}>
            {emptyText}
          </Typography>
        </div>
      );
    }

    return (
      <div className={styles.analyticsContent}>
        <div className={styles.analyticsDonutCard}>
          <div
            className={styles.analyticsDonut}
            style={{ "--ring-background": donutBackground }}
          >
            <div className={styles.analyticsDonutCenter}>
              <div className={styles.analyticsDonutValue}>
                {formatCurrency(totalAmount)}
              </div>
            </div>
          </div>
        </div>

        <div className={styles.analyticsLegendCard}>
          {segments.map((segment) => {
            const canOpenSegment = Boolean(
              onSegmentClick && segment.categoryIds?.length,
            );

            return (
              <button
                key={segment.label}
                type="button"
                className={styles.analyticsLegendItem}
                onClick={() => {
                  if (canOpenSegment) {
                    onSegmentClick(segment);
                  }
                }}
                disabled={!canOpenSegment}
              >
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
                    {formatCurrency(segment.amount)}
                  </span>
                  <span className={styles.analyticsLegendItemPercent}>
                    {getSegmentPercent(segment.amount, totalAmount)}%
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.analyticsCard}>
      {onClose && (
        <div className={styles.analyticsHeader}>
          <button
            type="button"
            className={styles.analyticsCloseButton}
            onClick={onClose}
          >
            <CloseIcon fontSize="small" />
            <span>Скрыть</span>
          </button>
        </div>
      )}

      <div className={styles.analyticsMonthCard}>
        <div className={styles.analyticsMonthRow}>
          <button
            type="button"
            className={styles.analyticsMonthButton}
            onClick={onPrevMonth}
            aria-label="Предыдущий месяц"
          >
            <KeyboardArrowLeftIcon fontSize="small" />
          </button>

          <Typography variant="body2" className={styles.analyticsSubtitle}>
            {monthLabel}
          </Typography>

          <button
            type="button"
            className={styles.analyticsMonthButton}
            onClick={onNextMonth}
            disabled={!canGoNext}
            aria-label="Следующий месяц"
          >
            <KeyboardArrowRightIcon fontSize="small" />
          </button>
        </div>
      </div>

      {renderContent()}
    </div>
  );
}
