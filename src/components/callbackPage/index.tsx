import React, { useEffect } from "react";
import { Spin } from "antd";
import NotificationMessage from "../common/notificationMessage.tsx";
import { handleTwitterAuthCallback } from "../../services/userApi.ts";
import { useNavigate, useSearchParams } from "react-router-dom";
const index = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const code = searchParams.get("code");
  useEffect(() => {
    if (!code) {
      NotificationMessage("error", "Twitter authentication failed!");
      navigate("/profile"); // Redirect back if no code
      return;
    }
    try {
      const response = await handleTwitterAuthCallback(code, name);
      if (response.success) {
        NotificationMessage("success", "Twitter connected successfully!");
      } else {
        NotificationMessage("error", "Failed to connect Twitter.");
      }
    } catch (error) {
      NotificationMessage("error", "Error during authentication.");
    } finally {
      navigate("/profile"); // Redirect after handling
    }
  }, [code]);

  return (
    <div>
      <Spin></Spin>{" "}
    </div>
  );
};

export default index;
