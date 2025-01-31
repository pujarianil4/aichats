import React, { useState } from "react";
import { Modal, Spin } from "antd";
import { FaDiscord, FaTelegramPlane } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import Telegram from "../social/telegram.tsx";
import Twitter from "../social/twitter.tsx";
import Discord from "../social/discord.tsx";
import { FaCheck } from "react-icons/fa";
import { BsDash } from "react-icons/bs";

interface SocialData {
  id: string;
  username: string;
  name: string;
}

interface SocialModalProps {
  discord?: SocialData;
  telegram?: SocialData;
  x?: SocialData;
}

const SocialModal: React.FC<SocialModalProps> = ({ discord, telegram, x }) => {
  const [connectedAccounts, setConnectedAccounts] = useState({
    Twitter: discord?.username as string | null,
    Telegram: telegram?.username as string | null,
    Discord: x?.username as string | null,
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [activePlatform, setActivePlatform] = useState<
    "Twitter" | "Telegram" | "Discord" | null
  >(null);
  const [loading, setLoading] = useState(false);

  const handleOpenModal = (platform: "Twitter" | "Telegram" | "Discord") => {
    setActivePlatform(platform);
    setModalVisible(true);
  };

  const handleConnectionSuccess = (
    platform: "Twitter" | "Telegram" | "Discord",
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

  const renderActivePlatformComponent = () => {
    switch (activePlatform) {
      case "Twitter":
        return (
          <Twitter
            onSuccess={(username: string) =>
              handleConnectionSuccess("Twitter", username)
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

  return (
    <>
      <p onClick={() => handleOpenModal("Twitter")}>
        {connectedAccounts.Twitter ? (
          <span className='c_icon'>
            <FaCheck color='#ff00b7' />
          </span>
        ) : (
          <span className='c_icon'>
            <BsDash color='#fff' />
          </span>
        )}
        <FaXTwitter /> <span>{connectedAccounts.Twitter || "Twitter"}</span>
      </p>
      <p onClick={() => handleOpenModal("Telegram")}>
        {connectedAccounts.Telegram ? (
          <span className='c_icon'>
            <FaCheck color='#ff00b7' />
          </span>
        ) : (
          <span className='c_icon'>
            <BsDash color='#fff' />
          </span>
        )}
        <FaTelegramPlane />{" "}
        <span>{connectedAccounts.Telegram || "Telegram"}</span>
      </p>
      <p onClick={() => handleOpenModal("Discord")}>
        {connectedAccounts.Discord ? (
          <span className='c_icon'>
            <FaCheck color='#ff00b7' />
          </span>
        ) : (
          <span className='c_icon'>
            <BsDash color='#fff' />
          </span>
        )}
        <FaDiscord /> <span>{connectedAccounts.Discord || "Discord"}</span>
      </p>

      <Modal
        title=''
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        centered
      >
        {loading ? (
          <div style={{ textAlign: "center" }}>
            <Spin />
          </div>
        ) : (
          renderActivePlatformComponent()
        )}
      </Modal>
    </>
  );
};

export default SocialModal;
