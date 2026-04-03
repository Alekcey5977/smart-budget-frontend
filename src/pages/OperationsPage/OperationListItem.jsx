import OperationIcon from "ui/OperationIcon";
import {
  formatOperationDateShort,
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
  return (
    <button
      type="button"
      className={styles.operationItem}
      onClick={() => onOpen(operation.id)}
    >
      <OperationIcon
        operation={operation}
        merchantImageLookup={merchantImageLookup}
        categoryImageLookup={categoryImageLookup}
        className={styles.operationCircle}
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
