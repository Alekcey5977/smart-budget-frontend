import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import {
  notificationApi,
  useGetUnreadNotificationsCountQuery,
} from "services/auth/notificationApi";
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
import styles from "./AuthLayout.module.scss";
import PhoneLayout from "layout/PhoneLayout/PhoneLayout";
import { logout } from "store/auth/authSlice";

export default function AuthLayout({ title = "", headerRightContent = null }) {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const token = useSelector((state) => state?.auth?.token);
  const user = useSelector((state) => state?.auth?.user);

  // Получаем количество непрочитанных уведомлений
  const { data: unreadCount = 0, refetch: refetchUnreadCount } =
    useGetUnreadNotificationsCountQuery(undefined, {
      pollingInterval: 30000,
      skip: !token,
    });

  // WebSocket подключение
  useEffect(() => {
    if (!token || !user?.id) {
      console.log("Нет токена или ID пользователя, WebSocket не подключается");
      return;
    }

    // Формируем правильный URL для WebSocket
    const wsProtocol = "ws:";
    const wsHost = "localhost:8080";
    const userId = user.id;
    const wsUrl = `${wsProtocol}//${wsHost}/notifications/new/s/${userId}/`;

    console.log(" Подключение к WebSocket:", wsUrl);

    let socket = null;
    let reconnectTimer = null;

    const connectWebSocket = () => {
      try {
        socket = new WebSocket(wsUrl);

        socket.onopen = () => {
          console.log(" WebSocket подключен успешно");
        };

        socket.onmessage = (event) => {
          console.log(" Получено сообщение через WebSocket:", event.data);

          try {
            const data = JSON.parse(event.data);
            console.log(" Разобранные данные:", data);

            // Инвалидируем кэш для обновления списка уведомлений и счетчика
            dispatch(
              notificationApi.util.invalidateTags([
                "Notifications",
                "UnreadNotificationsCount",
              ]),
            );

            // Дополнительно обновляем счетчик
            refetchUnreadCount();
          } catch (error) {
            console.error("Ошибка при разборе WebSocket сообщения:", error);
          }
        };

        socket.onerror = (error) => {
          console.error(" Ошибка WebSocket:", error);
        };

        socket.onclose = (event) => {
          console.log(
            " WebSocket закрыт. Код:",
            event.code,
            "Причина:",
            event.reason,
          );

          // Попытка переподключения через 5 секунд
          reconnectTimer = setTimeout(() => {
            console.log(" Попытка переподключения WebSocket...");
            connectWebSocket();
          }, 5000);
        };
      } catch (error) {
        console.error("Ошибка при создании WebSocket:", error);
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
              <Avatar className={styles.avatar}>
                <PersonIcon />
              </Avatar>
            </IconButton>

            <IconButton onClick={handleNotificationsClick}>
              <NotificationsNoneIcon />
            </IconButton>

            <Menu anchorEl={anchorEl} open={menuOpen} onClose={closeMenu}>
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
    </PhoneLayout>
  );
}
