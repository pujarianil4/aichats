import React, { useState } from "react";
import { Tabs } from "antd";
import "./index.scss";
import { FaDiscord, FaTelegram } from "react-icons/fa";
import type { TabsProps } from "antd";

const BindChat: React.FC = () => {
  const [telegramBot, setTelegramBot] = useState<string | null>("@telegrambot");
  const [discordBot, setDiscordBot] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"telegram" | "discord">(
    "telegram"
  );

  const handleDisconnect = (platform: "telegram" | "discord") => {
    if (platform === "telegram") {
      setTelegramBot(null);
    } else if (platform === "discord") {
      setDiscordBot(null);
    }
  };

  const handleBind = (platform: "telegram" | "discord", token: string) => {
    alert(`Binding ${platform} with token: ${token}`);
  };

  const handleCopy = () => {
    const inputElement = document.getElementById("name") as HTMLInputElement;
    if (inputElement) {
      inputElement.select();
      navigator.clipboard
        .writeText(inputElement.value)
        .then(() => {
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 2000);
        })
        .catch((err) => {
          console.error("Failed to copy text: ", err);
        });
    }
  };

  const handleConnect = () => {
    const inputElement = document.getElementById(
      "token-input"
    ) as HTMLInputElement;
    if (inputElement) {
      const token = inputElement.value.trim();
      if (token) {
        handleBind(activeTab, token);
      } else {
        alert("Please enter a valid access token.");
      }
    }
  };

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: (
        <div
          className={`tab-label ${activeTab === "telegram" ? "active" : ""}`}
        >
          <FaTelegram />
          <span>Telegram</span>
        </div>
      ),
      children: (
        <>
          {telegramBot ? (
            <div className='tab_bx'>
              <div className='tab-content'>
                <div className='current-bot'>
                  <div className='bot_inn'>Current Telegram Interface</div>
                  <a
                    href={`https://t.me/${telegramBot.replace("@", "")}`}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    {telegramBot}
                  </a>
                  <span
                    className='unbind'
                    onClick={() => handleDisconnect("telegram")}
                  >
                    Disconnect
                  </span>
                </div>
                <h2>Bind Telegram Group Chat</h2>
                <p>
                  Bind the Telegram group chat so the agent will only be active
                  there (<a href='#'>admin rights needed</a>). The group chat
                  link will be shown in the agent's profile on the discovery
                  page. If the agent isn't bound to any group chats, it will be
                  active in all group chats it's added to.
                </p>
                <div className='input_container'>
                  <input
                    value='https://t.me/+pKyvbKcLkrAzMzZl'
                    id='name'
                    type='text'
                    placeholder='Telegram invite Link'
                  />
                  <span className='copy_btn' onClick={() => handleCopy()}>
                    {isCopied ? "Copied" : "Copy"}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className='tab_bx'>
              <div className='tab-content'>
                <h2>Bind Telegram Group Chat</h2>
                {/* Telegram Steps */}
                <ol className='steps'>
                  <li>
                    <a
                      href='https://t.me/botfather'
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      Open t.me/botfather
                    </a>
                    , Telegram's official bot creation tool.
                  </li>
                  <li>
                    Send <code>/newbot</code> to create your bot, and BotFather
                    will return a Bot token after setting the name. Copy and
                    paste the bot token here.
                  </li>
                  <li>
                    Edit the bot's information or add a profile picture in
                    BotFather. You can edit the bot's profile picture in
                    <b>Edit bot pic</b>.
                  </li>
                  <li>
                    (Optional) Bind the Telegram group chat so your agent only
                    talks there. You can unbind or rebind the agent to a
                    different bot or group chat anytime.
                  </li>
                  <li>
                    Make the bot an admin in your group chat, then tag
                    <code>@youragent</code> to start.
                  </li>
                </ol>
                <div className='input_container'>
                  <label htmlFor='name'>
                    Bot Access Token
                    <span className='required'>*</span>
                  </label>
                  <input
                    id='token-input'
                    type='text'
                    placeholder='Enter your Token'
                  />
                </div>
              </div>
            </div>
          )}
        </>
      ),
    },
    {
      key: "2",
      label: (
        <div className={`tab-label ${activeTab === "discord" ? "active" : ""}`}>
          <FaDiscord />
          <span>Discord</span>
        </div>
      ),
      children: (
        <>
          {discordBot ? (
            <div className='tab_bx'>
              <div className='tab-content'>
                <div className='current-bot'>
                  <div className='bot_inn'>Current Discord Interface</div>
                  <a
                    href={`https://discord.com/`}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    {discordBot}
                  </a>
                  <span
                    className='unbind'
                    onClick={() => handleDisconnect("discord")}
                  >
                    Disconnect
                  </span>
                </div>
                <div className='input_container'>
                  <input
                    id='name'
                    type='text'
                    placeholder='Enter Server invite Link'
                  />
                  <span className='copy_btn' onClick={() => handleCopy()}>
                    {isCopied ? "Copied" : "Copy"}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className='tab_bx'>
              <div className='tab-content'>
                <h2>Bind Discord Group Chat</h2>
                {/* Discord Steps */}
                <ol className='steps'>
                  <li>
                    <a
                      href='https://discord.com/developers/applications'
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      Open Discord Developer Portal
                    </a>
                    .
                  </li>
                  <li>Create a New Application.</li>
                  <li>
                    Navigate to the <b>Bot</b> tab on the left:
                    <ul className='left_list'>
                      <li>
                        If you don't have a token, click <b>Reset Token</b> to
                        generate one.
                      </li>
                      <li>
                        Ensure <b>Message Content Intent</b> is turned ON.
                      </li>
                    </ul>
                  </li>
                  <li>Copy the bot token and paste it here to bind.</li>
                  <li>
                    Go to the <b>OAuth2 URL Generator</b> tab:
                    <ul className='left_list'>
                      <li>
                        Untick <b>User Install</b>.
                      </li>
                      <li>
                        Add <b>bot</b> under
                        <b>Default Install Settings Guild Install Scopes</b>.
                      </li>
                    </ul>
                  </li>
                  <li>
                    Copy and open the generated install link in your browser to
                    install the agent in your server.
                  </li>
                </ol>
                <div className='input_container'>
                  <label htmlFor='name'>
                    Bot Access Token
                    <span className='required'>*</span>
                  </label>
                  <input
                    id='name'
                    type='text'
                    placeholder='Discord Bot Token'
                  />
                </div>
              </div>
            </div>
          )}
        </>
      ),
    },
  ];

  const handleTabChange = (key: string) => {
    setActiveTab(key === "1" ? "telegram" : "discord");
  };

  return (
    <div className='social_bx'>
      <div className='bind-chat-container'>
        <Tabs
          className='social_tabs'
          type='card'
          centered={true}
          items={items}
          onChange={handleTabChange}
        />
      </div>
      <div className='connect_btn' onClick={handleConnect}>
        Connect
      </div>
    </div>
  );
};

export default BindChat;
