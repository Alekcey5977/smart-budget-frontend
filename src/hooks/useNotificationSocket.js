import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAuthToken } from "store/auth/authsSelectors";
import { notificationApi } from "services/auth/notificationApi";

const getWsUrl = (token) => {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
  return apiUrl.replace(/^http/, "ws").replace(/\/$/, "") + `/ws/notification?token=${token}`;
};

export const useNotificationSocket = () => {
  const token = useSelector(getAuthToken);
  const dispatch = useDispatch();
  const wsRef = useRef(null);
  const reconnectTimer = useRef(null);
  const isUnmounted = useRef(false);

  useEffect(() => {
    if (!token) return;

    let ws = null;
    let reconnectTimer = null;
    let isEffectActive = true;

    const connect = () => {
      if (!isEffectActive) return;

      const url = getWsUrl(token);
      console.log("[WS] Connecting to:", url.replace(/token=.*/, "token=***"));

      ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log("[WS] ✅ Connected! Notifications will arrive instantly.");
      };

      ws.onmessage = (event) => {
        console.log("[WS] 📬 New notification received:", event.data);
        dispatch(
          notificationApi.util.invalidateTags([
            { type: "Notifications", id: "LIST" },
            "UnreadNotificationsCount",
          ])
        );
        dispatch({ type: "historyApi/invalidateTags", payload: ["History"] });
      };

      ws.onerror = (err) => {
        console.warn("[WS] ❌ Connection error:", err);
      };

      ws.onclose = (event) => {
        if (!isEffectActive) return;
        console.log(`[WS] 🔌 Disconnected (code=${event.code}, reason="${event.reason}"). Reconnecting in 3s...`);
        reconnectTimer = setTimeout(connect, 3000);
      };
    };

    connect();

    return () => {
      isEffectActive = false;
      clearTimeout(reconnectTimer);
      if (ws) {
        ws.onclose = null;
        ws.close();
      }
    };
  }, [token, dispatch]);
};
