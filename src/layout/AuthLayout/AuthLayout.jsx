import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { useNotifications } from "hooks/useNotifications";
import { getAuthToken, getAuthUser } from "store/auth/authsSelectors";
import {
  Avatar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Badge,
  Box,
} from "@mui/material";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import styles from "./AuthLayout.module.scss";
import PhoneLayout from "layout/PhoneLayout/PhoneLayout";
import { logout } from "store/auth/authSlice";

export default function AuthLayout({ title = "", headerRightContent = null }) {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const token = useSelector(getAuthToken);
  const user = useSelector(getAuthUser);

  const { unreadCount } = useNotifications();

  const { data: myAvatar } = useGetMyAvatarQuery();

  const [isAvatarSelectorOpen, setIsAvatarSelectorOpen] = useState(false);

  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);
  const openMenu = (e) => setAnchorEl(e.currentTarget);
  const closeMenu = () => setAnchorEl(null);

  const handleLogout = useCallback(() => {
    closeMenu();
    dispatch(logout());
    navigate("/", { replace: true });
  }, [dispatch, navigate]);

  const isDashboard =
    location.pathname === "/" || location.pathname === "/home";
  const showBack = !isDashboard;

  const handleNotificationsClick = () => {
    navigate("/notifications");
  };

  return (
    <PhoneLayout>
      <div
        className={`${styles.header} ${showBack ? styles.headerPage : styles.headerMain}`}
      >
        {showBack ? (
          <>
            <IconButton
              className={styles.backButton}
              onClick={() => navigate("/home")}
              sx={{
                bgcolor: "primary.main",
                color: "text.primary",
                borderRadius: "15px",
                width: 40,
                height: 40,
              }}
            >
              <ArrowBackIcon fontSize="small" />
            </IconButton>
            <Typography variant="h6" className={styles.pageTitle}>
              {title}
            </Typography>
            <div className={styles.pageRight}>{headerRightContent}</div>
          </>
        ) : (
          <>
            <Box sx={{ position: "relative" }}>
              <Avatar
                className={styles.avatar}
                onClick={openMenu}
                sx={{
                  bgcolor: "primary.main",
                  width: 40,
                  height: 40,
                  cursor: "pointer",
                }}
              >
                <PersonIcon />
              </Avatar>
            </Box>

            <IconButton
              onClick={handleNotificationsClick}
              sx={{ width: 40, height: 40 }}
            >
              <Badge
                color="error"
                variant="dot"
                invisible={!unreadCount || unreadCount === 0}
                overlap="circular"
              >
                <NotificationsNoneIcon />
              </Badge>
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={menuOpen}
              onClose={closeMenu}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "center",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "center",
              }}
            >
              <MenuItem
                onClick={() => {
                  closeMenu();
                  navigate("/profile");
                }}
              >
                <ListItemIcon>
                  <PersonIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Профиль" />
              </MenuItem>
              <MenuItem onClick={handleLogout} sx={{ color: "error.main" }}>
                <ListItemIcon sx={{ color: "error.main" }}>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Выйти" />
              </MenuItem>
            </Menu>
          </>
        )}
      </div>
      <div className={styles.content}>
        <Outlet />
      </div>

      <AvatarSelector
        open={isAvatarSelectorOpen}
        onClose={() => setIsAvatarSelectorOpen(false)}
      />
    </PhoneLayout>
  );
}
