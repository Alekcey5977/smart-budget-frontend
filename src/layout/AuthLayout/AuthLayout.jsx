import { useCallback, useMemo, useState } from "react";
import {
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import PhoneLayout from "layout/PhoneLayout/PhoneLayout";
import { logout } from "store/auth/authSlice";
import styles from "./AuthLayout.module.scss";

export default function AuthLayout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { pathname } = useLocation();

  const isProfile = pathname.startsWith("/profile");

  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);

  const openMenu = useCallback((e) => setAnchorEl(e.currentTarget), []);
  const closeMenu = useCallback(() => setAnchorEl(null), []);

  const onGoProfile = useCallback(() => {
    closeMenu();
    navigate("/profile");
  }, [closeMenu, navigate]);

  const onLogout = useCallback(() => {
    closeMenu();
    dispatch(logout());
    navigate("/", { replace: true });
  }, [closeMenu, dispatch, navigate]);

  const onBack = useCallback(() => {
    // безопаснее явно на дашборд, чем navigate(-1)
    navigate("/home");
  }, [navigate]);

  const menuPaperSx = useMemo(
    () => ({
      borderRadius: 3,
      minWidth: 230, // сделал чуть больше
      "& .MuiMenuItem-root": {
        py: 1.2, // увеличили высоту клика
      },
    }),
    [],
  );

  return (
    <PhoneLayout>
      <div className={styles.header}>
        {isProfile ? (
          <IconButton aria-label="Назад" onClick={onBack}>
            <ArrowBackIcon />
          </IconButton>
        ) : (
          <>
            <IconButton
              aria-label="Меню профиля"
              onClick={openMenu}
              sx={{ p: 0 }}
            >
              <Avatar className={styles.avatar}>
                <PersonIcon />
              </Avatar>
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={menuOpen}
              onClose={closeMenu}
              PaperProps={{ sx: menuPaperSx }}
              anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
              transformOrigin={{ vertical: "top", horizontal: "left" }}
            >
              <MenuItem onClick={onGoProfile}>
                <ListItemIcon>
                  <PersonIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Профиль" />
              </MenuItem>

              <MenuItem onClick={onLogout}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" sx={{ color: "error.main" }} />
                </ListItemIcon>
                <ListItemText
                  primary="Выйти из аккаунта"
                  primaryTypographyProps={{ sx: { color: "error.main" } }}
                />
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
