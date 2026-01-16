import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { getIsAuth } from "../store/auth/authsSelectors";

const PrivateRoute = () => {
  const isAuth = useSelector(getIsAuth);

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
