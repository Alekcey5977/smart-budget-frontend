export const OPERATIONS_ANALYTICS_CONFIG = {
  expense: {
    title: "Расходы",
    errorText: "Не удалось загрузить расходы",
    emptyText: "Нет расходов за выбранный период",
  },
  income: {
    title: "Доходы",
    errorText: "Не удалось загрузить доходы",
    emptyText: "Нет доходов за выбранный период",
  },
};

export const OPERATIONS_ANALYTICS_TYPES = Object.keys(
  OPERATIONS_ANALYTICS_CONFIG,
);

export function getOperationsAnalyticsConfig(type) {
  return OPERATIONS_ANALYTICS_CONFIG[type] ?? null;
}
