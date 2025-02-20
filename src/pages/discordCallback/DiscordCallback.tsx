import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { fetchDiscordData } from "../../services/auth.ts";

const DiscordCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchToken = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");

      if (!code) {
        console.error("🚨 No OAuth code found!");
        return;
      }

      try {
        const response = await fetchDiscordData(code);
        console.log("User Data:", response);
        // Store the user info in localStorage or state management
        // localStorage.setItem("user", JSON.stringify(response.data));
        // navigate("/dashboard"); // Redirect after login
      } catch (error) {
        console.error("Error fetching Discord user:", error);
      }
    };

    fetchToken();
  }, [navigate]);

  return <p>Logging in...</p>;
};

export default DiscordCallback;
