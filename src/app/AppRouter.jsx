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

import PrivateRoute from "app/PrivateRoute";
import AuthLayout from "layout/AuthLayout";
import PageLayout from "layout/PageLayout";

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
          <Route path="/profile" element={<ProfilePage />} />
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
