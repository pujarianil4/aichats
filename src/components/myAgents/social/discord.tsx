import React, { useState } from "react";

import "./index.scss";

const Discord: React.FC<{
  onSuccess: (username: string) => void;
  onFailure: () => void;
  initialUsername?: string;
}> = ({ onSuccess, onFailure, initialUsername }) => {
  const [isUserConnected, setIsUserConnected] = useState(false);
  const [discordUsername, SetDiscordUsername] = useState<string | null>(
    initialUsername || null
  );

  const handleConnect = async () => {
    try {
      // api call
      const username = "@sandeepDiscord";
      SetDiscordUsername(username);
      setIsUserConnected(true);
      onSuccess(username);
    } catch (error) {
      setIsUserConnected(false);
      onFailure();
    }
  };

  const [isCopied, setIsCopied] = useState(false);

  const handleDisconnect = () => {
    SetDiscordUsername(null);
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
          {isUserConnected && discordUsername ? (
            <div className='tab_bx'>
              <div className='tab-content'>
                <div className='current-bot'>
                  <div className='bot_inn'>Current Discord Interface</div>
                  <a
                    href={`https://discord.com/`}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    {discordUsername}
                  </a>
                  <span className='unbind' onClick={() => handleDisconnect()}>
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
      </div>
      <div className='connect_btn' onClick={handleConnect}>
        Connect
      </div>
    </div>
  );
};

export default Discord;
