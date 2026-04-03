import {
  getOperationColor,
  getOperationImageUrl,
} from "utils/operationHelpers";

export default function OperationIcon({
  operation,
  merchantImageLookup,
  categoryImageLookup,
  className,
}) {
  const iconUrl = getOperationImageUrl(
    operation,
    merchantImageLookup,
    categoryImageLookup,
  );
  const style = iconUrl
    ? {
        backgroundImage: `url(${iconUrl})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
      }
    : { backgroundColor: getOperationColor(operation) };

  return <div className={className} style={style} />;
}
