import axios from "axios";
import { getCurrentDomain } from "../utils/index.ts";
import { api } from "./apiconfig.ts";

export const handleAuthConnect = async (payload: {
  sig: `0x${string}` | string | undefined;
  msg: string;
  typ: string;
}) => {
  const response = await api.post("/auth/connect", payload);

  console.log("LOGIN_RES", response);
  // setToLocalStorage("userSession", response.data);
  return response.data;
};

export const handleAuthDisconnect = async () => {
  try {
    const response = await api.patch("/auth/disconnect");
    return response.data;
  } catch (error) {
    throw error;
  }
};

interface TelegramLoginData {
  auth_date: number;
  first_name: string;
  hash: string;
  id: number;
  last_name?: string;
  username?: string;
}

interface Telegram {
  Login: {
    auth: (
      options: {
        bot_id: string | undefined;
        request_access?: boolean;
        lang?: string;
      },
      callback: (data: TelegramLoginData | false) => void
    ) => void;
  };
}

// Extend the global Window interface to include Telegram
declare global {
  interface Window {
    Telegram: Telegram;
  }
}

export const handleTelegramAuth = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?27";
    script.async = true;
    document.body.appendChild(script);
    const botID = import.meta.env.VITE_TELEGRAM_BOT_ID_USER;
    script.onload = () => {
      if (window.Telegram) {
        window.Telegram.Login.auth(
          { bot_id: botID, request_access: true },
          (data) => {
            if (!data) {
              console.error("Authorization failed");
              reject("Authorization failed");
              return;
            }

            if (
              typeof data.id === "number" &&
              typeof data.username === "string"
            ) {
              // updateUser({
              //   telegram: {
              //     id: String(data.id),
              //     username: data.username,
              //   },
              // })
              //   .then(() => {
              //     refetch();
              //     NotificationMessage("success", "Telegram Profile linked.");
              //   })
              //   .catch((err) => {
              //     console.error("Failed to link Telegram Profile:", err);
              //     NotificationMessage("error", err?.message);
              //   });
            } else {
              console.error("Invalid Telegram data received:", data);

              reject("Invalid Telegram data");
              return;
            }

            console.log("Telegram data:", data);
            resolve(data);
          }
        );
      } else {
        reject("Telegram object not found");
      }
    };

    script.onerror = () => {
      reject("Failed to load Telegram script");
    };
  });
};

export const handleXLogin = async () => {
  const currentDomain = window.location.origin; // More reliable

  const rootUrl = "https://twitter.com/i/oauth2/authorize";
  const clientId = import.meta.env.VITE_TWITTER_ID;
  const codeVerifier = import.meta.env.VITE_X_CODEVERIFIER;
  const redirectUri = `${currentDomain}/xcallback`;
  const state = "state";
  const codeChallenge = codeVerifier as string;

  const options = {
    response_type: "code",
    client_id: clientId,
    redirect_uri: redirectUri,
    state: state,
    code_challenge: codeChallenge,
    code_challenge_method: "plain",
    scope: ["tweet.read", "users.read", "offline.access"].join(" "),
  };
  const qs = new URLSearchParams(options).toString();
  const authUrl = `${rootUrl}?${qs}`;
  window.location.href = authUrl;
  // window.open(authUrl, "_blank");
};

export const handleDiscordLogin = async () => {
  const currentDomain = window.location.origin; // More reliable
  const clientId =
    import.meta.env.VITE_PUBLIC_DISCORD_ID || "default_client_id";

  if (!clientId || clientId === "default_client_id") {
    console.error("🚨 Discord Client ID is missing! Check your .env file.");
    return;
  }

  const redirectUri = encodeURIComponent(
    `${currentDomain}/discordcallback`
    // "https://samdevai.netlify.app/profile"
  );

  const oauthUrl = `https://discord.com/oauth2/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=identify`;

  console.log("Redirecting to:", oauthUrl); // Debugging
  window.location.href = oauthUrl;
};

export const fetchDiscordData = async (code: string) => {
  try {
    console.log("fetch code works");
    if (!code) {
      throw new Error("Authorization code is missing");
    }

    const currentDomain = getCurrentDomain();
    const redirectUri = `${currentDomain}/api/callback/discord`;
    const secretCode = import.meta.env.VITE_PUBLIC_DISCORD_ID;
    const clientSecret = import.meta.env.Vite_PUBLIC_DISCORD_SECRET;
    if (!secretCode || !clientSecret || !redirectUri) {
      throw new Error("Discord client ID or secret is missing");
    }

    const params = new URLSearchParams({
      client_id: secretCode,
      client_secret: clientSecret,
      grant_type: "authorization_code",
      code: code,
      redirect_uri: redirectUri,
    });

    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
    };

    const tokenResponse = await axios.post(
      "https://discord.com/api/oauth2/token",
      params,
      { headers }
    );
    const { access_token } = tokenResponse.data;
    const userResponse = await axios.get("https://discord.com/api/users/@me", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    const user = userResponse.data;
    return user;
  } catch (error) {
    console.error("Error during Discord OAuth callback:", error);
    throw error;
  }
};
