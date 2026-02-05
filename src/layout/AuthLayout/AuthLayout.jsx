import { useCallback, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Outlet } from "react-router-dom";
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
import styles from "./AuthLayout.module.scss";
import PhoneLayout from "layout/PhoneLayout/PhoneLayout";
import { logout } from "store/auth/authSlice";

export default function AuthLayout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);

  const openMenu = useCallback((e) => {
    setAnchorEl(e.currentTarget);
  }, []);

  const closeMenu = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const goProfile = useCallback(() => {
    closeMenu();
    navigate("/profile");
  }, [closeMenu, navigate]);

  const handleLogout = useCallback(() => {
    closeMenu();
    dispatch(logout());
    navigate("/", { replace: true });
  }, [closeMenu, dispatch, navigate]);

  const menuPaperSx = useMemo(
    () => ({
      borderRadius: 2,
      boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
    }),
    [],
  );

  const menuItemSx = useMemo(
    () => ({
      py: 1.2,
      px: 2,
      gap: 1.2,
    }),
    [],
  );

  return (
    <PhoneLayout>
      <div className={styles.header}>
        <IconButton aria-label="Профиль" onClick={openMenu}>
          <Avatar className={styles.avatar}>
            <PersonIcon />
          </Avatar>
        </IconButton>
        <IconButton aria-label="Уведомления">
          <NotificationsNoneIcon />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={menuOpen}
          onClose={closeMenu}
          PaperProps={{ sx: menuPaperSx }}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          transformOrigin={{ vertical: "top", horizontal: "left" }}
        >
          <MenuItem onClick={goProfile} sx={menuItemSx}>
            <ListItemIcon>
              <PersonIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Профиль" />
          </MenuItem>
          <MenuItem
            onClick={handleLogout}
            sx={{ ...menuItemSx, color: "error.main" }}
          >
            <ListItemIcon sx={{ color: "error.main" }}>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Выйти из аккаунта" />
          </MenuItem>
        </Menu>
      </div>
      <div className={styles.content}>
        <Outlet />
      </div>
    </PhoneLayout>
  );
}
