import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { fetchDiscordData } from "../../services/auth.ts";
import { handleSocialCallback } from "../../services/userApi.ts";
import { useAppSelector } from "../../hooks/reduxHooks.tsx";
import NotificationMessage from "../../components/common/notificationMessage.tsx";

const XCallback = () => {
  const navigate = useNavigate();
  const { isLoading, profile, error } = useAppSelector((state) => state.user);
  const userId = profile?.uId;
  useEffect(() => {
    const fetchToken = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");

      if (!code) {
        console.error("🚨 No OAuth code found!");
        return;
      }
      const data = {
        id: userId,
        code: code,
        name: "x",
        type: "user",
      };

      try {
        const response = await handleSocialCallback(data);
        console.log("User Data:", response);

        if (response) {
          NotificationMessage("success", "X Added Successfully!");
        }
        navigate("/profile");
      } catch (error) {
        navigate("/profile");
        NotificationMessage("error", "Something Went Wrong");
        console.error("Error fetching Discord user:", error);
      }
    };

    fetchToken();
  }, [navigate]);

  return <p>Logging in...</p>;
};

export default XCallback;
