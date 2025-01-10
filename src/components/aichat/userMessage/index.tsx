import React from "react";
import "./index.scss";

interface UserMessageProps {
  userIcon: string; // URL or path to user icon
  userName: string;
  message: string;
}

export default function UserMessage({
  userIcon,
  userName,
  message,
}: UserMessageProps) {
  return (
    <>
      <div className='admin'>
        <img
          src={userIcon}
          alt={`${userName}'s icon`}
          className='user-message__icon'
        />
        <div className='admin__content'>
          <span className='admin__name'>0xghfr...789776:</span>
          <span className='admin__value'> $1000 </span>
          <div className='admin__text'>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </div>
        </div>
      </div>

      <div className='user-message'>
        <img
          src={userIcon}
          alt={`${userName}'s icon`}
          className='user-message__icon'
        />
        <div className='user-message__content'>
          <span className='user-message__name'>{userName}:</span>
          <span className='user-message__text'>{message}</span>
        </div>
      </div>
    </>
  );
}
