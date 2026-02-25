import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getIsAuth } from "store/auth/authsSelectors";

import WelcomePage from "pages/WelcomePage";
import LoginPage from "pages/LoginPage";
import RegistrationPage from "pages/Registration";
import HomePage from "pages/HomePage";
import GoalsPage from "pages/GoalsPage";
import GoalCreatePage from "pages/GoalCreatePage";
import ProfilePage from "pages/ProfilePage/ProfilePage";
import BankAccountPage from "pages/BankAccountPage/BankAccountPage";
import BankAccountAddPage from "pages/BankAccountAddPage/BankAccountAddPage";
import PrivateRoute from "app/PrivateRoute";
import AuthLayout from "layout/AuthLayout";

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

      <Route element={<PrivateRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/bank-accounts" element={<BankAccountPage />} />
          <Route path="/bank-accounts/add" element={<BankAccountAddPage />} />
        </Route>

        <Route element={<AuthLayout showBack title="Цели" />}>
          <Route path="/goals" element={<GoalsPage />} />
        </Route>

        <Route element={<AuthLayout showBack title="Создание цели" />}>
          <Route path="/goals/create" element={<GoalCreatePage />} />
        </Route>

        <Route element={<AuthLayout showBack title="Ваша цель" />}>
          <Route path="/goals/:goalId" element={<GoalDetailsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
