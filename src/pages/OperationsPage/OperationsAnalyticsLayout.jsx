import { Navigate, useParams } from "react-router-dom";
import AuthLayout from "layout/AuthLayout/AuthLayout";
import { getOperationsAnalyticsConfig } from "./operationsAnalyticsConfig";

export default function OperationsAnalyticsLayout() {
  const { type } = useParams();
  const config = getOperationsAnalyticsConfig(type);

  if (!config) {
    return <Navigate to="/operations" replace />;
  }

  return <AuthLayout title={config.title} backPath="/operations" />;
}
