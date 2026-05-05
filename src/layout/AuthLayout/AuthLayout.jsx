import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { useNotifications } from "hooks/useNotifications";
import { useNotificationSocket } from "hooks/useNotificationSocket";
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
import HomeIcon from "@mui/icons-material/Home";
import EditIcon from "@mui/icons-material/Edit";
import AvatarSelector from "ui/AvatarSelector/AvatarSelector";
import { useGetMyAvatarQuery } from "services/auth/avatarApi";
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
  useNotificationSocket();

  const { data: myAvatar } = useGetMyAvatarQuery();

  const [isAvatarSelectorOpen, setIsAvatarSelectorOpen] = useState(false);

  const [anchorEl, setAnchorEl] = useState(null);
  const [pageHeaderAction, setPageHeaderAction] = useState(null);
  const [pageTitle, setPageTitle] = useState(null);

  useEffect(() => {
    setPageTitle(null);
  }, [title]);

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
              <HomeIcon fontSize="small" />
            </IconButton>
            <Typography variant="h6" className={styles.pageTitle} noWrap>
              {pageTitle || title}
            </Typography>

            <div className={styles.pageRight}>{pageHeaderAction}</div>
          </>
        ) : (
          <>
            <Box sx={{ position: "relative" }}>
              <Avatar
                key={myAvatar?.image_id || myAvatar?.id || "no-avatar"}
                className={styles.avatar}
                onClick={openMenu}
                src={
                  myAvatar?.image_id
                    ? `/images/${myAvatar.image_id}`
                    : myAvatar?.id
                      ? `/images/${myAvatar.id}`
                      : undefined
                }
                sx={{
                  bgcolor: "#cbcbcb",
                  width: 40,
                  height: 40,
                  cursor: "pointer",
                }}
              >
                {!(myAvatar?.image_id || myAvatar?.id) && <PersonIcon />}
              </Avatar>
            </Box>

            <Typography variant="h6" className={styles.pageTitle} noWrap sx={{ flexGrow: 1, textAlign: "center", overflow: "hidden", textOverflow: "ellipsis" }}>
              {pageTitle || title}
            </Typography>

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
                  setIsAvatarSelectorOpen(true);
                }}
              >
                <ListItemIcon>
                  <EditIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Изменить аватар" />
              </MenuItem>
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
        <Outlet context={{ setPageHeaderAction, setPageTitle }} />
      </div>

      <AvatarSelector
        open={isAvatarSelectorOpen}
        onClose={() => setIsAvatarSelectorOpen(false)}
      />
    </PhoneLayout>
  );
}
