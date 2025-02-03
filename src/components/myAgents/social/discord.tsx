import React, { useState } from "react";
import "./index.scss";

const Discord: React.FC<{
  onSuccess: (username: string) => void;
  onFailure: () => void;
  initialUsername?: string;
}> = ({ onSuccess, onFailure, initialUsername }) => {
  const [isUserConnected, setIsUserConnected] = useState(false);
  const [discordUsername, setDiscordUsername] = useState<string | null>(
    initialUsername || null
  );
  const [accessToken, setAccessToken] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  const handleConnect = async () => {
    try {
      if (!accessToken) {
        alert("Please enter a valid Discord Bot Token.");
        return;
      }

      // Example API call to fetch bot data using the Discord Bot Token
      const response = await fetch("https://discord.com/api/v10/users/@me", {
        headers: {
          Authorization: `Bot ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to connect the bot. Check the token.");
      }

      const data = await response.json();
      console.log("discord Bot Data", data);
      const username = data.username;

      setDiscordUsername(username);
      setIsUserConnected(true);
      onSuccess(username);
    } catch (error) {
      console.error("Connection failed:", error);
      setIsUserConnected(false);
      onFailure();
    }
  };

  const handleDisconnect = () => {
    setDiscordUsername(null);
    setIsUserConnected(false);
    setAccessToken("");
    onSuccess("");
  };

  const handleCopy = () => {
    const inputElement = document.getElementById(
      "server-link"
    ) as HTMLInputElement;
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
          {isUserConnected && discordUsername ? (
            <div className='tab_bx'>
              <div className='tab-content'>
                <div className='current-bot'>
                  <div className='bot_inn'>Current Discord Bot</div>
                  <a
                    href={`https://discord.com/`}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    {discordUsername}
                  </a>
                  <span className='unbind' onClick={handleDisconnect}>
                    Disconnect
                  </span>
                </div>
                <h2>Bind Discord Group Chat</h2>
                <p>
                  Bind the Discord group chat so the agent will only be active
                  there (<a href='#'>admin rights needed</a>). The group chat
                  link will be shown in the agent's profile on the discovery
                  page. If the agent isn't bound to any group chats, it will be
                  active in all group chats it's added to.
                </p>
                <div className='input_container'>
                  <input
                    id='server-link'
                    type='text'
                    value='https://discord.gg/example-link'
                    readOnly
                  />
                  <span className='copy_btn' onClick={handleCopy}>
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
                    Use the <b>OAuth2 URL Generator</b> to install the bot in
                    your server.
                  </li>
                </ol>
                <div className='input_container'>
                  <label htmlFor='bot-token'>
                    Bot Access Token <span className='required'>*</span>
                  </label>
                  <input
                    id='bot-token'
                    type='text'
                    placeholder='Discord Bot Token'
                    value={accessToken}
                    onChange={(e) => setAccessToken(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}
        </>
      </div>
      {isUserConnected ? (
        ""
      ) : (
        <div className='connect_btn' onClick={handleConnect}>
          Connect
        </div>
      )}
    </div>
  );
};

export default Discord;
