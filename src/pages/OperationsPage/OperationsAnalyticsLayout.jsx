import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { IconButton, Typography } from "@mui/material";
import { Navigate, Outlet, useParams } from "react-router-dom";
import PhoneLayout from "layout/PhoneLayout/PhoneLayout";
import authLayoutStyles from "layout/AuthLayout/AuthLayout.module.scss";
import { useAppBackNavigation } from "hooks/useAppBackNavigation";
import { getOperationsAnalyticsConfig } from "./operationsAnalyticsConfig";

export default function OperationsAnalyticsLayout() {
  const { type } = useParams();
  const handleBack = useAppBackNavigation("/operations");
  const config = getOperationsAnalyticsConfig(type);

  if (!config) {
    return <Navigate to="/operations" replace />;
  }

  return (
    <PhoneLayout>
      <div className={`${authLayoutStyles.header} ${authLayoutStyles.headerPage}`}>
        <IconButton
          className={authLayoutStyles.backButton}
          onClick={handleBack}
          aria-label="Назад"
          sx={{
            bgcolor: "primary.main",
            color: "text.primary",
            borderRadius: "15px",
            width: 40,
            height: 40,
          }}
        >
          <ArrowBackIosNewIcon fontSize="small" />
        </IconButton>
        <Typography variant="h6" className={authLayoutStyles.pageTitle}>
          {config.title}
        </Typography>
        <div className={authLayoutStyles.pageRight} />
      </div>

      <div className={authLayoutStyles.content}>
        <Outlet />
      </div>
    </PhoneLayout>
  );
}
