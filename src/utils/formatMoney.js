const moneyFormatter = new Intl.NumberFormat("ru-RU", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export function formatMoney(value) {
  const number = Number(value || 0);
  if (!Number.isFinite(number)) {
    return "0";
  }

  const normalized = Math.trunc(number * 100) / 100;
  return moneyFormatter.format(normalized);
}
