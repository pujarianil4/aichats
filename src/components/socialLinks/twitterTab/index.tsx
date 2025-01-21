import React, { useState } from "react";

import "../index.scss";

import { Switch, Input } from "antd";
import { BsQuestionCircle } from "react-icons/bs";

interface AppState {
  openForAll: boolean;
  quickReply: boolean;
  timelineLimit: number;
  mentionsLimit: number;
  groupChatLimit: number;
  groupChatNotification: boolean;
}
const BindChat: React.FC = () => {
  const [twitterBot, setTwitterBot] = useState<string | null>("@twitterbot");
  const [state, setState] = useState<AppState>({
    openForAll: true,
    quickReply: true,
    timelineLimit: 0,
    mentionsLimit: 0,
    groupChatLimit: 24,
    groupChatNotification: true,
  });
  const handleOpenForAllChange = (checked: boolean) => {
    setState((prevState) => ({ ...prevState, openForAll: checked }));
  };

  const handleQuickReplyChange = (checked: boolean) => {
    setState((prevState) => ({ ...prevState, quickReply: checked }));
  };

  const handleTimelineLimitChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseInt(e.target.value, 10) || 0;
    setState((prevState) => ({ ...prevState, timelineLimit: value }));
  };

  const handleMentionsLimitChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseInt(e.target.value, 10) || 0;
    setState((prevState) => ({ ...prevState, mentionsLimit: value }));
  };

  const handleGroupChatLimitChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseInt(e.target.value, 10) || 0;
    setState((prevState) => ({ ...prevState, groupChatLimit: value }));
  };

  const handleGroupChatNotificationChange = (checked: boolean) => {
    setState((prevState) => ({ ...prevState, groupChatNotification: checked }));
  };
  const handleDisconnect = () => {
    setTwitterBot(null);
  };
  const handleConnect = () => {};
  return (
    <div className='social_bx'>
      <div className='bind-chat-container'>
        {twitterBot ? (
          <div className='tab_bx'>
            <div className='tab-content'>
              <div className='current-bot'>
                <div className='bot_inn'>Current Twitter Interface</div>
                <a
                  href={`https://t.me/${twitterBot.replace("@", "")}`}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  {twitterBot}
                </a>
                <span className='unbind' onClick={() => handleDisconnect()}>
                  Disconnect
                </span>
              </div>
              <h2>Bind Telegram Group Chat</h2>

              <div className='container'>
                <h4 className='command_header'>
                  Group Chat Commands <BsQuestionCircle />
                </h4>

                <div className='setting'>
                  <span>Open for all group members</span>
                  <Switch
                    checked={state.openForAll}
                    onChange={handleOpenForAllChange}
                  />
                </div>

                <div className='setting'>
                  <span>Quick reply without tagging</span>
                  <Switch
                    checked={state.quickReply}
                    onChange={handleQuickReplyChange}
                  />
                </div>

                <div className='limit_bx'>
                  <h3>Autonomous Tweeting</h3>
                  <div className='limit-setting'>
                    <span>Daily auto-reply limit for timeline</span>

                    <input
                      value={state.timelineLimit}
                      id='name'
                      type='number'
                      onChange={handleTimelineLimitChange}
                    />
                  </div>
                  <div className='limit-setting'>
                    <span>Daily auto-reply limit for mentions</span>
                    <input
                      type='number'
                      value={state.mentionsLimit}
                      onChange={handleMentionsLimitChange}
                    />
                  </div>
                  <div className='limit-setting'>
                    <span>Daily auto-tweet limit from group chat</span>
                    <input
                      type='number'
                      value={state.groupChatLimit}
                      onChange={handleGroupChatLimitChange}
                    />
                  </div>
                </div>

                <div className='setting'>
                  <span>Group Chat Notification</span>
                  <Switch
                    checked={state.groupChatNotification}
                    onChange={handleGroupChatNotificationChange}
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className='tab_bx'>
            <div className='tab-content'>
              <h2>Connect Your Twitter Account</h2>

              <p>
                Bind existing Twitter account with the agent for the agent to
                autonomously send tweets on this account. The default limit is
                the agent can tweet maximum once every 15 minutes.don't forget
                to add "@Laama_ai" to the agent's bio!
              </p>
            </div>
          </div>
        )}
      </div>
      <div className='connect_btn' onClick={handleConnect}>
        {twitterBot ? "Update" : "Connect "}
      </div>
    </div>
  );
};

export default BindChat;
