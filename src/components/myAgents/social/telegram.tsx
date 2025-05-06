import React, { useState } from "react";
import "./index.scss";
import { connectWithTelegram } from "../../../services/api.ts";
import { useParams } from "react-router-dom";
const Telegram: React.FC<{
  onSuccess: (username: string) => void;
  onFailure: () => void;
  initialUsername?: string;
}> = ({ onSuccess, onFailure, initialUsername }) => {
  const { agentId } = useParams();
  const [botToken, setBotToken] = useState("");
  const [isUserConnected, setIsUserConnected] = useState(false);
  const [telegramUsername, setTelegramUsername] = useState<string | null>(
    initialUsername || null
  );

  const handleConnect = async () => {
    try {
      if (!botToken) {
        alert("Please enter a valid Bot Access Token.");
        return;
      }

      const response = await fetch(
        `https://api.telegram.org/bot${botToken}/getMe`
      );
      const data = await response.json();
      console.log("Telegram Bot Data", data);
      console.group("data", data);
      if (data.ok) {
        const payload = {
          token: botToken,
          aId: agentId as string,
        };
        await connectWithTelegram(payload);
        const username = `@${data.result.username}`;
        setTelegramUsername(username);
        setIsUserConnected(true);
        onSuccess(username);
      } else {
        throw new Error("Invalid Bot Token.");
      }
    } catch (error) {
      setIsUserConnected(false);
      onFailure();
      console.error("Error connecting bot:", error);
      alert("Failed to connect bot. Please check the token and try again.");
    }
  };

  const [isCopied, setIsCopied] = useState(false);

  const handleDisconnect = () => {
    setTelegramUsername(null);
    onSuccess("");
    setBotToken("");
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

  return (
    <div className='social_bx'>
      <div className='bind-chat-container'>
        <>
          {isUserConnected && telegramUsername ? (
            <div className='tab_bx'>
              <div className='tab-content'>
                <div className='current-bot'>
                  <div className='bot_inn'>Current Telegram Interface</div>
                  <a
                    href={`https://t.me/${telegramUsername.replace("@", "")}`}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    {telegramUsername}
                  </a>
                  <span className='unbind' onClick={() => handleDisconnect()}>
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
                    type='text'
                    placeholder='Enter your Token'
                    value={botToken}
                    onChange={(e) => setBotToken(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}
        </>
      </div>
      <div className='connect_btn' onClick={handleConnect}>
        Connect
      </div>
    </div>
  );
};

export default Telegram;
