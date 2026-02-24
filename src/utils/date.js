import dayjs from "dayjs";
import "dayjs/locale/ru";

dayjs.locale("ru");

export function formatDateRu(value) {
  const date = dayjs(value);
  if (!date.isValid()) {
    return String(value || "");
  }
  return date.format("D MMMM YYYY");
}

export function toInputDate(value) {
  const date = dayjs(value);
  if (!date.isValid()) {
    return "";
  }
  return date.format("YYYY-MM-DD");
}

export function getMonthsLeft(value) {
  const date = dayjs(value).startOf("day");
  if (!date.isValid()) {
    return 0;
  }

  const today = dayjs().startOf("day");
  const monthsLeft = date.diff(today, "month", true);
  if (monthsLeft <= 0) {
    return 0;
  }

  return monthsLeft;
}
