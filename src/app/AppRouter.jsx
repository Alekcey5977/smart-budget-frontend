import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "../hoc/PrivateRoute";
import LoginPage from "../pages/LoginPage/LoginPage";
import HomePage from "../pages/HomePage";
const AppRouter = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<PrivateRoute />}>
        <Route path="/" element={<HomePage />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRouter;
