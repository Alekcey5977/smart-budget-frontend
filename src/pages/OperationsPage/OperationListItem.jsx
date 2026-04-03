import {
  formatOperationDateShort,
  getOperationColor,
  getOperationImageUrl,
  getOperationSignedAmount,
  getOperationTitle,
  isIncomeOperation,
} from "utils/operationHelpers";
import styles from "./OperationsPage.module.scss";

export default function OperationListItem({
  operation,
  onOpen,
  merchantImageLookup,
  categoryImageLookup,
}) {
  const iconUrl = getOperationImageUrl(
    operation,
    merchantImageLookup,
    categoryImageLookup,
  );
  const iconStyle = iconUrl
    ? {
        backgroundImage: `url(${iconUrl})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
      }
    : { backgroundColor: getOperationColor(operation) };

  return (
    <button
      type="button"
      className={styles.operationItem}
      onClick={() => onOpen(operation.id)}
    >
      <div
        className={styles.operationCircle}
        style={iconStyle}
      />

      <div className={styles.operationMain}>
        <div className={styles.operationTitle}>{getOperationTitle(operation)}</div>
        <div className={styles.operationDate}>
          {formatOperationDateShort(operation.created_at)}
        </div>
      </div>

      <div
        className={
          isIncomeOperation(operation)
            ? styles.operationIncome
            : styles.operationExpense
        }
      >
        {getOperationSignedAmount(operation)}
      </div>
    </button>
  );
}
