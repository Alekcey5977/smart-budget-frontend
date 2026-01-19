import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { getIsAuth } from "store/auth/authsSelectors";

import WelcomePage from "pages/WelcomePage/WelcomePage";
import LoginPage from "pages/LoginPage/LoginPage";
import HomePage from "pages/HomePage/HomePage";
import ProfilePage from "pages/ProfilePage/ProfilePage";

import PrivateRoute from "app/PrivateRoute";
import AuthLayout from "layout/AuthLayout/AuthLayout";

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

      <Route element={<PrivateRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
