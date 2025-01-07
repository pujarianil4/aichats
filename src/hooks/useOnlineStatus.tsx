import { useEffect, useState } from "react";

const HEARTBEAT_KEY = "last-heartbeat";
const HEARTBEAT_INTERVAL = 5000; // 5 seconds
const OFFLINE_THRESHOLD = 10000; // 10 seconds (5 minutes in ms)

const useOnlineStatus = (): boolean => {
  const [isOnline, setIsOnline] = useState<boolean>(false);
  const [isTabActive, setIsTabActive] = useState<boolean>(true);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsTabActive(!document.hidden);
    };

    const handleFocus = () => setIsTabActive(true);
    const handleBlur = () => setIsTabActive(false);

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);
    window.addEventListener("blur", handleBlur);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("blur", handleBlur);
    };
  }, []);

  useEffect(() => {
    const broadcast = new BroadcastChannel("user-status");

    const updateHeartbeat = () => {
      const now = Date.now();
      localStorage.setItem(HEARTBEAT_KEY, now.toString());
      broadcast.postMessage("heartbeat");
    };

    const checkOtherTabsStatus = () => {
      const lastHeartbeat = parseInt(
        localStorage.getItem(HEARTBEAT_KEY) || "0",
        10
      );
      const isCurrentlyOnline = Date.now() - lastHeartbeat < OFFLINE_THRESHOLD;
      setIsOnline(isCurrentlyOnline);
    };

    const handleBroadcastMessage = (event: MessageEvent<string>) => {
      if (event.data === "heartbeat") {
        checkOtherTabsStatus();
      }
    };

    broadcast.addEventListener("message", handleBroadcastMessage);

    // Heartbeat for the current tab
    if (isTabActive) {
      setIsOnline(true);
      updateHeartbeat();
    } else {
      setIsOnline(false);
    }

    const interval = setInterval(() => {
      if (isTabActive) {
        updateHeartbeat();
      }
      checkOtherTabsStatus();
    }, HEARTBEAT_INTERVAL);

    return () => {
      clearInterval(interval);
      broadcast.close();
    };
  }, [isTabActive]);

  useEffect(() => {
    // Update the tab title based on the user's online status
    document.title = isOnline ? "🟢 User is Online" : "🔴 User is Offline";
  }, [isOnline]);

  return isOnline;
};

export default useOnlineStatus;
