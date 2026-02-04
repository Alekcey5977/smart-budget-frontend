import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { getIsAuth } from "store/auth/authsSelectors";

import WelcomePage from "pages/WelcomePage/WelcomePage";
import LoginPage from "pages/LoginPage/LoginPage";
import RegistrationPage from "pages/Registration/RegistrationPage";
import HomePage from "pages/HomePage/HomePage";
import GoalsPage from "pages/GoalsPage/GoalsPage";
import GoalCreatePage from "pages/GoalCreatePage/GoalCreatePage";

import PrivateRoute from "app/PrivateRoute";
import AuthLayout from "layout/AuthLayout/AuthLayout";
import PageLayout from "layout/PageLayout/PageLayout";

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
        element={isAuth ? <Navigate to="/home" replace /> : <RegistrationPage />}
      />

      <Route element={<PrivateRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/home" element={<HomePage />} />
        </Route>

        <Route
          path="/goals"
          element={
            <PageLayout title="Цели">
              <GoalsPage />
            </PageLayout>
          }
        />

        <Route
          path="/goals/create"
          element={
            <PageLayout title="Создание цели">
              <GoalCreatePage />
            </PageLayout>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
