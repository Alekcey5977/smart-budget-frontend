import {
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import React from "react";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import PersonIcon from "@mui/icons-material/Person";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LogoutIcon from "@mui/icons-material/Logout";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { logout } from "store/auth/authSlice";
import PhoneLayout from "layout/PhoneLayout/PhoneLayout";
import styles from "./AuthLayout.module.scss";

export default function AuthLayout() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const dispatch = useDispatch();

  const isProfile = pathname === "/profile";

  const [anchorEl, setAnchorEl] = React.useState(null);
  const menuOpen = Boolean(anchorEl);

  const openMenu = (e) => setAnchorEl(e.currentTarget);
  const closeMenu = () => setAnchorEl(null);

  const goProfile = () => {
    closeMenu();
    navigate("/profile");
  };

  const doLogout = () => {
    closeMenu();
    dispatch(logout());
    navigate("/", { replace: true });
  };

  return (
    <PhoneLayout>
      <div className={styles.header}>
        {isProfile ? (
          <IconButton
            aria-label="Назад"
            className={styles.backButton}
            onClick={() => navigate("/home")}
          >
            <ArrowBackIcon />
          </IconButton>
        ) : (
          <>
            <IconButton
              aria-label="Меню профиля"
              onClick={openMenu}
              className={styles.avatarButton}
            >
              <Avatar className={styles.avatar}>
                <PersonIcon />
              </Avatar>
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={menuOpen}
              onClose={closeMenu}
              anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
              transformOrigin={{ vertical: "top", horizontal: "left" }}
            >
              <MenuItem onClick={goProfile}>
                <ListItemIcon>
                  <PersonIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Профиль</ListItemText>
              </MenuItem>

              <MenuItem onClick={doLogout}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Выйти из аккаунта</ListItemText>
              </MenuItem>
            </Menu>
          </>
        )}

        <IconButton aria-label="Уведомления">
          <NotificationsNoneIcon />
        </IconButton>
      </div>

      <div className={styles.content}>
        <Outlet />
      </div>
    </PhoneLayout>
  );
}
