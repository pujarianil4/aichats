import React, { useEffect, useState } from "react";
import { Modal, Spin } from "antd";
import { FaDiscord, FaTelegramPlane } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import Telegram from "./social/telegram.tsx";
import Twitter from "./social/twitter.tsx";
import Discord from "./social/discord.tsx";
import { FaCheck } from "react-icons/fa";
import { BsDash } from "react-icons/bs";
import {
  handleDiscordLogin,
  handleTelegramAuth,
  handleXLogin,
} from "../../services/auth.ts";
import { updateUser } from "../../services/userApi.ts";
import NotificationMessage from "../common/notificationMessage.tsx";
interface SocialModalProps {
  user: any;
  type?: "user" | "agent";
  setDataLoad: any;
}

const SocialModal: React.FC<SocialModalProps> = ({
  user,
  type = "agent",
  setDataLoad,
}) => {
  const [connectedAccounts, setConnectedAccounts] = useState({
    X: user?.x?.username || null,
    Telegram: user?.telegram?.username || null,
    Discord: user?.discord?.username || null,
  });

  useEffect(() => {
    setConnectedAccounts({
      X: user?.x?.username || null,
      Telegram: user?.telegram?.username || null,
      Discord: user?.discord?.username || null,
    });
  }, [user]);
  console.log("connecte4d account", connectedAccounts);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalRemove, setModalRemove] = useState(false);
  const [activePlatform, setActivePlatform] = useState<
    "X" | "Telegram" | "Discord" | null
  >(null);
  const [loading, setLoading] = useState(false);

  const handleOpenModal = async (platform: "X" | "Telegram" | "Discord") => {
    if (type == "agent") {
      setActivePlatform(platform);
      setModalVisible(true);
    } else {
      if (platform == "Telegram") {
        await handleTeleAuth();
      } else if (platform == "Discord") {
        await handleDiscordAuth();
      } else if (platform == "X") {
        await handleXAuth();
      } else {
      }
    }
  };

  const handleRemoveModal = (platform: "X" | "Telegram" | "Discord") => {
    setActivePlatform(platform);
    setModalRemove(true);
  };

  const handleConnectionSuccess = (
    platform: "X" | "Telegram" | "Discord",
    username: string
  ) => {
    setConnectedAccounts((prev) => ({
      ...prev,
      [platform]: username || null,
    }));
    setLoading(false);
    setModalVisible(true);
  };

  const handleConnectionFailure = () => {
    setLoading(false);
  };

  const handleXAuth = async () => {
    try {
      const data = await handleXLogin();
    } catch (error) {}
  };

  const handleTeleAuth = async () => {
    try {
      const data = await handleTelegramAuth();
      const updateData = {
        telegram: {
          id: String(data.id),
          username: data.username,
        },
      };
      const response = await updateUser(user.id, updateData);

      if (response) {
        setDataLoad(true);
        NotificationMessage("success", "Telegram Added Successfully!");
      }
    } catch (error) {
      NotificationMessage("error", "Telegram not Added!");
    }
  };

  const handleDiscordAuth = async () => {
    try {
      const data = await handleDiscordLogin();
    } catch (error) {}
  };

  const renderActivePlatformComponent = () => {
    switch (activePlatform) {
      case "X":
        return (
          <Twitter
            onSuccess={(username: string) =>
              handleConnectionSuccess("X", username)
            }
            onFailure={handleConnectionFailure}
          />
        );
      case "Telegram":
        return (
          <Telegram
            onSuccess={(username: string) =>
              handleConnectionSuccess("Telegram", username)
            }
            onFailure={handleConnectionFailure}
            initialUsername={connectedAccounts.Telegram || undefined}
          />
        );
      case "Discord":
        return (
          <Discord
            onSuccess={(username: string) =>
              handleConnectionSuccess("Discord", username)
            }
            onFailure={handleConnectionFailure}
            initialUsername={connectedAccounts.Discord || undefined}
          />
        );
      default:
        return null;
    }
  };

  const handleRemoveAccount = async () => {
    if (!activePlatform) return;

    try {
      const updateData = {
        [activePlatform.toLowerCase()]: null,
      };

      const response = await updateUser(user.id, updateData);
      if (response) {
        setConnectedAccounts((prev) => ({
          ...prev,
          [activePlatform]: null,
        }));
        setModalRemove(false);
        NotificationMessage(
          "success",
          `${activePlatform} account removed successfully!`
        );
      }
    } catch (error) {
      NotificationMessage(
        "error",
        `Failed to remove ${activePlatform} account.`
      );
    }
  };

  return (
    <>
      <p>
        {connectedAccounts.X ? (
          <div onClick={() => handleRemoveModal("X")}>
            <span className='c_icon'>
              <FaCheck color='#ff00b7' />
            </span>

            <FaXTwitter />
            <span>{connectedAccounts.X}</span>
          </div>
        ) : (
          <div onClick={() => handleOpenModal("X")}>
            <span className='c_icon'>
              <BsDash color='#fff' />
            </span>

            <FaXTwitter />
            <span>Twitter</span>
          </div>
        )}
      </p>

      <p>
        {connectedAccounts.Telegram ? (
          <div onClick={() => handleRemoveModal("Telegram")}>
            <span className='c_icon'>
              <FaCheck color='#ff00b7' />
            </span>

            <FaTelegramPlane />
            <span>{connectedAccounts.Telegram}</span>
          </div>
        ) : (
          <div onClick={() => handleOpenModal("Telegram")}>
            <span className='c_icon'>
              <BsDash color='#fff' />
            </span>

            <FaTelegramPlane />
            <span>Telegram</span>
          </div>
        )}
      </p>
      <p>
        {connectedAccounts.Discord ? (
          <div onClick={() => handleRemoveModal("Discord")}>
            <span className='c_icon'>
              <FaCheck color='#ff00b7' />
            </span>

            <FaDiscord />
            <span>{connectedAccounts.Discord}</span>
          </div>
        ) : (
          <div onClick={() => handleOpenModal("Discord")}>
            <span className='c_icon'>
              <BsDash color='#fff' />
            </span>

            <FaDiscord />
            <span>Discord</span>
          </div>
        )}
      </p>

      <Modal
        title=''
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        centered
        className='social_modal'
      >
        {loading ? (
          <div style={{ textAlign: "center" }}>
            <Spin />
          </div>
        ) : (
          renderActivePlatformComponent()
        )}
      </Modal>
      <Modal
        title='Remove Your Account'
        open={modalRemove}
        onCancel={() => setModalRemove(false)}
        footer={null}
        centered
        className='social_modal'
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <button onClick={handleRemoveAccount}>Remove {activePlatform}</button>
        </div>
      </Modal>
    </>
  );
};

export default SocialModal;
