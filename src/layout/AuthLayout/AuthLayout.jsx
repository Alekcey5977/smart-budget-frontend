import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import {
  notificationApi,
  useGetUnreadNotificationsCountQuery,
} from "services/auth/notificationApi";
import { useGetMyAvatarQuery } from "services/auth/avatarApi";
import AvatarSelector from "ui/AvatarSelector/AvatarSelector";
import {
  Avatar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Badge,
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
  const token = useSelector((state) => state?.auth?.token);
  const user = useSelector((state) => state?.auth?.user);

  const { data: unreadCount = 0, refetch: refetchUnreadCount } =
    useGetUnreadNotificationsCountQuery(undefined, {
      pollingInterval: 30000,
      skip: !token,
    });

  const { data: myAvatar } = useGetMyAvatarQuery(undefined, {
    skip: !token,
  });

  const [isAvatarSelectorOpen, setIsAvatarSelectorOpen] = useState(false);

  useEffect(() => {
    if (!token || !user?.id) {
      return;
    }

    const wsProtocol = "ws:";
    const wsHost = "localhost:8080";
    const userId = user.id;
    const wsUrl = `${wsProtocol}//${wsHost}/notifications/new/s/${userId}/`;

    let socket = null;
    let reconnectTimer = null;

    const connectWebSocket = () => {
      try {
        socket = new WebSocket(wsUrl);

        socket.onopen = () => {
        };

        socket.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);

            dispatch(
              notificationApi.util.invalidateTags([
                "Notifications",
                "UnreadNotificationsCount",
              ]),
            );

            refetchUnreadCount();
          } catch (error) {
          }
        };

        socket.onerror = (error) => {
        };

        socket.onclose = (event) => {
          reconnectTimer = setTimeout(() => {
            connectWebSocket();
          }, 5000);
        };
      } catch (error) {
      }
    };

    connectWebSocket();

    return () => {
      if (socket) {
        socket.close();
      }
      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
      }
    };
  }, [token, user?.id, dispatch, refetchUnreadCount]);

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
            <IconButton onClick={openMenu}>
              <Avatar
                className={styles.avatar}
                src={myAvatar?.id ? `/images/images/${myAvatar.id}` : null}
                sx={{
                  bgcolor: myAvatar?.id ? "transparent" : "primary.main",
                  width: 40,
                  height: 40,
                }}
              >
                {!myAvatar?.id && <PersonIcon />}
              </Avatar>
            </IconButton>

            <IconButton onClick={handleNotificationsClick}>
              <Badge badgeContent={unreadCount} color="error">
                <NotificationsNoneIcon />
              </Badge>
            </IconButton>

            <Menu anchorEl={anchorEl} open={menuOpen} onClose={closeMenu}>
              <MenuItem
                onClick={() => {
                  closeMenu();
                  setIsAvatarSelectorOpen(true);
                }}
              >
                <ListItemIcon>
                  <EditIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Сменить аватар" />
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
        <Outlet />
      </div>

      <AvatarSelector
        open={isAvatarSelectorOpen}
        onClose={() => setIsAvatarSelectorOpen(false)}
      />
    </PhoneLayout>
  );
}
