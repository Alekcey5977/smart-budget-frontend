import {
  Routes,
  Route,
  Navigate,
  useParams,
  useNavigate,
} from "react-router-dom";
import { useSelector } from "react-redux";
import { getIsAuth } from "store/auth/authsSelectors";
import { IconButton } from "@mui/material";

// Иконки для шапки уведомлений
import CheckIcon from "@mui/icons-material/Check";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

// Страницы
import WelcomePage from "pages/WelcomePage";
import LoginPage from "pages/LoginPage";
import RegistrationPage from "pages/Registration";
import HomePage from "pages/HomePage";
import GoalsPage from "pages/GoalsPage";
import GoalCreatePage from "pages/GoalsPage/GoalCreatePage";
import ProfilePage from "pages/ProfilePage/ProfilePage";
import BankAccountPage from "pages/BankAccountPage/BankAccountPage";
import BankAccountAddPage from "pages/BankAccountAddPage/BankAccountAddPage";

// Уведомления
import NotificationsPage from "pages/NotificationPage/NotificationsPage";
import NotificationDetailsPage from "pages/NotificationPage/NotificationDetailsPage";
import PrivateRoute from "app/PrivateRoute";
import AuthLayout from "layout/AuthLayout";

// API
import {
  useMarkAllNotificationsAsReadMutation,
  useDeleteNotificationMutation,
} from "services/auth/notificationApi";

function MarkAllReadButton() {
  const [markAll] = useMarkAllNotificationsAsReadMutation();

  return (
    <IconButton aria-label="Прочитать все" onClick={() => markAll()}>
      <CheckIcon />
    </IconButton>
  );
}

function NotificationDeleteButton() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [deleteNotif] = useDeleteNotificationMutation();

  const handleDelete = async () => {
    // Проверка, что id существует, чтобы не отправить запрос на undefined
    if (!id) return;

    if (window.confirm("Удалить это уведомление?")) {
      try {
        await deleteNotif(id).unwrap();
        navigate("/notifications", { replace: true });
      } catch (error) {
        console.error("Ошибка при удалении:", error);
      }
    }
  };

  return (
    <IconButton aria-label="Удалить" onClick={handleDelete}>
      <DeleteOutlineIcon />
    </IconButton>
  );
}
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
          element={
            <AuthLayout
              title="Уведомления"
              headerRightContent={<MarkAllReadButton />}
            />
          }
        >
          <Route index element={<NotificationsPage />} />
        </Route>

        {/* Layout для деталей уведомления (Заголовок + Корзина) */}
        {/* ИСПРАВЛЕНИЕ: path перенесен сюда, чтобы useParams() работал в кнопке */}
        <Route
          path="/notifications/:id"
          element={
            <AuthLayout
              title="Уведомление"
              headerRightContent={<NotificationDeleteButton />}
            />
          }
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
      </Route>

      {/* Если путь не найден — кидаем на главную */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
