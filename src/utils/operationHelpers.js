import dayjs from "dayjs";
import "dayjs/locale/ru";
import { formatMoney } from "utils/formatMoney";

dayjs.locale("ru");

const OPERATION_COLORS = [
  "#ff8b2a",
  "#f5c400",
  "#19c3b8",
  "#18a9c9",
  "#1f8ef1",
  "#7a7d86",
];

const EXPENSE_DONUT_COLORS = [
  "#efd95f",
  "#e1b700",
  "#5d5f66",
  "#1bbdb2",
  "#1b9fd1",
  "#ff8b2a",
];

const INCOME_DONUT_COLORS = [
  "#2abf56",
  "#53cb72",
  "#1bbdb2",
  "#18a9c9",
  "#74d49f",
  "#7a7d86",
];

export function isIncomeOperation(operation) {
  return operation?.type === "income";
}

export function getOperationTitle(operation) {
  return (
    operation?.merchant_name ||
    operation?.description ||
    operation?.category_name ||
    "Операция"
  );
}

export function getOperationColor(operation) {
  const source = `${operation?.category_id || ""}${getOperationTitle(operation)}`;
  let sum = 0;

  for (let i = 0; i < source.length; i += 1) {
    sum += source.charCodeAt(i);
  }

  const index = sum % OPERATION_COLORS.length;
  return OPERATION_COLORS[index];
}

export function buildImageMappingLookup(mappings) {
  const lookup = new Map();

  if (!Array.isArray(mappings)) {
    return lookup;
  }

  mappings.forEach((item) => {
    if (item?.entity_id == null || !item?.image_id) {
      return;
    }

    lookup.set(String(item.entity_id), String(item.image_id));
  });

  return lookup;
}

export function getOperationImageId(
  operation,
  merchantImageLookup,
  categoryImageLookup,
) {
  if (operation?.merchant_id != null) {
    const merchantImageId = merchantImageLookup?.get(String(operation.merchant_id));
    if (merchantImageId) {
      return merchantImageId;
    }
  }

  if (operation?.category_id != null) {
    const categoryImageId = categoryImageLookup?.get(String(operation.category_id));
    if (categoryImageId) {
      return categoryImageId;
    }
  }

  return null;
}

export function getOperationImageUrl(
  operation,
  merchantImageLookup,
  categoryImageLookup,
) {
  const imageId = getOperationImageId(
    operation,
    merchantImageLookup,
    categoryImageLookup,
  );

  if (!imageId) {
    return null;
  }

  return `/images/${imageId}`;
}

export function getOperationSignedAmount(operation) {
  const sign = isIncomeOperation(operation) ? "+" : "-";
  const amount = Math.abs(Number(operation?.amount || 0));
  return `${sign}${formatMoney(amount)} ₽`;
}

export function formatOperationDateShort(value) {
  const date = dayjs(value);
  if (!date.isValid()) {
    return "";
  }
  return date.format("D MMM.");
}

export function formatOperationDateTime(value) {
  const date = dayjs(value);
  if (!date.isValid()) {
    return "";
  }
  return date.format("D MMMM, HH:mm");
}

export function formatOperationsGroupTitle(value) {
  const date = dayjs(value);
  if (!date.isValid()) {
    return "";
  }

  const today = dayjs();
  if (date.isSame(today, "day")) {
    return "Сегодня";
  }

  if (date.isSame(today.subtract(1, "day"), "day")) {
    return "Вчера";
  }

  return date.format("D MMMM, dd");
}

export function getMonthLabel(monthDate) {
  const label = monthDate.format("MMMM");
  return label.charAt(0).toUpperCase() + label.slice(1);
}

export function getLatestOperationsMonth(operations) {
  if (!Array.isArray(operations) || operations.length === 0) {
    return dayjs().startOf("month");
  }

  let latestDate = null;

  operations.forEach((operation) => {
    const operationDate = dayjs(operation?.created_at);
    if (!operationDate.isValid()) {
      return;
    }

    if (!latestDate || operationDate.isAfter(latestDate)) {
      latestDate = operationDate;
    }
  });

  if (!latestDate) {
    return dayjs().startOf("month");
  }

  return latestDate.startOf("month");
}

export function filterOperationsByMonth(operations, monthDate) {
  if (!Array.isArray(operations)) {
    return [];
  }

  return operations.filter((operation) => {
    const operationDate = dayjs(operation?.created_at);
    if (!operationDate.isValid()) {
      return false;
    }

    return operationDate.isSame(monthDate, "month");
  });
}

function getCategorySegmentsByType(
  operations,
  transactionType,
  maxSegments,
  colors,
) {
  const grouped = {};

  operations.forEach((operation) => {
    const isIncome = isIncomeOperation(operation);

    if (
      (transactionType === "income" && !isIncome) ||
      (transactionType === "expense" && isIncome)
    ) {
      return;
    }

    const amount = Math.abs(Number(operation?.amount || 0));
    if (!Number.isFinite(amount) || amount <= 0) {
      return;
    }

    const key =
      operation?.category_id !== undefined && operation?.category_id !== null
        ? String(operation.category_id)
        : operation?.category_name || "other";

    if (!grouped[key]) {
      grouped[key] = {
        label: operation?.category_name || "Другое",
        amount: 0,
      };
    }

    grouped[key].amount += amount;
  });

  const sorted = Object.values(grouped).sort((a, b) => b.amount - a.amount);

  if (sorted.length <= maxSegments) {
    return sorted.map((item, index) => ({
      ...item,
      color: colors[index % colors.length],
    }));
  }

  const result = sorted.slice(0, maxSegments - 1).map((item, index) => ({
    ...item,
    color: colors[index % colors.length],
  }));

  const restAmount = sorted
    .slice(maxSegments - 1)
    .reduce((sum, item) => sum + item.amount, 0);

  result.push({
    label: "Другое",
    amount: restAmount,
    color: colors[(maxSegments - 1) % colors.length],
  });

  return result;
}

export function getExpenseCategorySegments(operations, maxSegments = 3) {
  return getCategorySegmentsByType(
    operations,
    "expense",
    maxSegments,
    EXPENSE_DONUT_COLORS,
  );
}

export function getIncomeCategorySegments(operations, maxSegments = 3) {
  return getCategorySegmentsByType(
    operations,
    "income",
    maxSegments,
    INCOME_DONUT_COLORS,
  );
}

export function buildDonutGradient(segments, fallbackColor = "rgba(0, 0, 0, 0.22)") {
  if (!Array.isArray(segments) || segments.length === 0) {
    return `conic-gradient(${fallbackColor} 0% 100%)`;
  }

  const total = segments.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  if (total <= 0) {
    return `conic-gradient(${fallbackColor} 0% 100%)`;
  }

  let current = 0;

  const parts = segments.map((item, index) => {
    const amount = Number(item.amount || 0);
    const ratio = amount > 0 ? (amount / total) * 100 : 0;
    const start = current;
    const end = index === segments.length - 1 ? 100 : current + ratio;
    current = end;
    return `${item.color} ${start}% ${end}%`;
  });

  return `conic-gradient(${parts.join(", ")})`;
}
