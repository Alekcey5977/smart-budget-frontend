import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getIsAuth } from "store/auth/authsSelectors";
import WelcomePage from "pages/WelcomePage";
import LoginPage from "pages/LoginPage";
import RegistrationPage from "pages/Registration";
import HomePage from "pages/HomePage";
import GoalsPage, { GoalCreatePage, GoalDetailsPage } from "pages/GoalsPage";
import OperationsPage from "pages/OperationsPage";
import OperationDetailsPage from "pages/OperationDetailsPage";
import OperationsAnalyticsPage from "pages/OperationsPage/OperationsAnalyticsPage";
import OperationsAnalyticsLayout from "pages/OperationsPage/OperationsAnalyticsLayout";
import ProfilePage from "pages/ProfilePage";
import BankAccountPage from "pages/BankAccountPage/BankAccountPage";
import BankAccountAddPage from "pages/BankAccountAddPage/BankAccountAddPage";
import NotificationsPage from "pages/NotificationPage/NotificationsPage";
import HistoryPage from "pages/NotificationPage/HistoryPage";
import NotificationDetailsPage from "pages/NotificationPage/NotificationDetailsPage";
import NotificationsLayout from "pages/NotificationPage/NotificationsLayout";
import NotificationDetailsLayout from "pages/NotificationPage/NotificationDetailsLayout";
import PrivateRoute from "app/PrivateRoute";
import AuthLayout from "layout/AuthLayout";

export default function AppRouter() {
  const isAuth = useSelector(getIsAuth);

  return (
    <Routes>
      <Route path="/" element={<WelcomePage />} />
      <Route
        path="/login"
        element={isAuth ? <Navigate to="/home" replace /> : <LoginPage />}
      />
      <Route
        path="/register"
        element={
          isAuth ? <Navigate to="/home" replace /> : <RegistrationPage />
        }
      />

      <Route element={<PrivateRoute />}>
        <Route path="/home" element={<AuthLayout title="Главная" />}>
          <Route index element={<HomePage />} />
        </Route>

        <Route path="/bank-accounts" element={<AuthLayout title="Банковские счета" />}>
          <Route index element={<BankAccountPage />} />
        </Route>

        <Route path="/bank-accounts/add" element={<AuthLayout title="Добавить счёт" />}>
          <Route index element={<BankAccountAddPage />} />
        </Route>

        <Route path="/profile" element={<AuthLayout title="Профиль" />}>
          <Route index element={<ProfilePage />} />
        </Route>

        <Route path="/history" element={<AuthLayout title="История" />}>
          <Route index element={<HistoryPage />} />
        </Route>

        <Route path="/notifications" element={<NotificationsLayout />}>
          <Route index element={<NotificationsPage />} />
        </Route>

        <Route path="/notifications/:id" element={<NotificationDetailsLayout />}>
          <Route index element={<NotificationDetailsPage />} />
        </Route>

        <Route path="/goals" element={<AuthLayout title="Цели" />}>
          <Route index element={<GoalsPage />} />
        </Route>

        <Route
          path="/goals/create"
          element={<AuthLayout title="Создание цели" />}
        >
          <Route index element={<GoalCreatePage />} />
        </Route>

        <Route element={<AuthLayout showBack title="Ваша цель" />}>
          <Route path="/goals/:goalId" element={<GoalDetailsPage />} />
        </Route>

        <Route element={<AuthLayout showBack title="История операций" />}>
          <Route path="/operations" element={<OperationsPage />} />
        </Route>

        <Route
          path="/operations/analytics/:type"
          element={<OperationsAnalyticsLayout />}
        >
          <Route index element={<OperationsAnalyticsPage />} />
        </Route>

        <Route element={<AuthLayout showBack title="Детали операции" />}>
          <Route path="/operations/:operationId" element={<OperationDetailsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
