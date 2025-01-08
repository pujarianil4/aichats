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
  );
}
