import {
  Routes,
  Route,
  Navigate,
  useParams,
  useNavigate,
} from "react-router-dom";
import { useSelector } from "react-redux";
import { getIsAuth } from "store/auth/authsSelectors";


// Страницы
import WelcomePage from "pages/WelcomePage";
import LoginPage from "pages/LoginPage";
import RegistrationPage from "pages/Registration";
import HomePage from "pages/HomePage";
import GoalsPage, { GoalCreatePage, GoalDetailsPage } from "pages/GoalsPage";
import OperationsPage from "pages/OperationsPage";
import OperationDetailsPage from "pages/OperationDetailsPage";
import ProfilePage from "pages/ProfilePage";
import BankAccountPage from "pages/BankAccountPage/BankAccountPage";
import BankAccountAddPage from "pages/BankAccountAddPage/BankAccountAddPage";

// Уведомления
import NotificationsPage from "pages/NotificationPage/NotificationsPage";
import NotificationDetailsPage from "pages/NotificationPage/NotificationDetailsPage";
import NotificationsLayout from "pages/NotificationPage/NotificationsLayout";
import NotificationDetailsLayout from "pages/NotificationPage/NotificationDetailsLayout";
import PrivateRoute from "app/PrivateRoute";
import AuthLayout from "layout/AuthLayout";

// ОСНОВНОЙ РОУТЕР

export default function AppRouter() {
  const isAuth = useSelector(getIsAuth);

  return (
    <Routes>
      <Route
        path="/"
        element={isAuth ? <Navigate to="/home" replace /> : <WelcomePage />}
      />
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

      {/* ПРИВАТНЫЕ РОУТЫ (Только для авторизованных) */}
      <Route element={<PrivateRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/bank-accounts" element={<BankAccountPage />} />
          <Route path="/bank-accounts/add" element={<BankAccountAddPage />} />
        </Route>

        {/* Layout для списка уведомлений (Заголовок + Галочка) */}
        <Route
          path="/notifications"
          element={<NotificationsLayout />}
        >
          <Route index element={<NotificationsPage />} />
        </Route>

        {/* Layout для деталей уведомления (Заголовок + Корзина) */}
        {/* ИСПРАВЛЕНИЕ: path перенесен сюда, чтобы useParams() работал в кнопке */}
        <Route
          path="/notifications/:id"
          element={<NotificationDetailsLayout />}
        >
          <Route index element={<NotificationDetailsPage />} />
        </Route>

        {/* Layout для целей */}
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

        <Route element={<AuthLayout showBack title="Детали операции" />}>
          <Route path="/operations/:operationId" element={<OperationDetailsPage />} />
        </Route>
      </Route>

      {/* Если путь не найден — кидаем на главную */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
