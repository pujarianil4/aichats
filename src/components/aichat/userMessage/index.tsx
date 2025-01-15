import React from "react";
import "./index.scss";

interface UserMessageProps {
  userIcon: string; // URL or path to user icon
  userName?: string;
  message?: string;
  data: any;
}

export const shortenAddress = (address: string) =>
  address && `${address.slice(0, 5)}....${address.slice(address.length - 5)}`;

export default function UserMessage({
  userIcon,
  // userName,
  // message,
  data,
}: UserMessageProps) {
  return (
    <>
      {data?.amnt ? (
        <div className='admin'>
          <img
            src={userIcon}
            alt={`${data.senderAddress}'s icon`}
            className='user-message__icon'
          />
          <div className='admin__content'>
            <span className='admin__name'>
              {shortenAddress(data.senderAddress)}:
            </span>
            <span className='admin__value'> ${data.amnt} </span>
            <div className='admin__text'>{data.content}</div>
          </div>
        </div>
      ) : (
        <div className='user-message'>
          <img
            src={userIcon}
            alt={`${data.senderAddress}'s icon`}
            className='user-message__icon'
          />
          <div className='user-message__content'>
            <span className='user-message__name'>
              {shortenAddress(data.senderAddress)}:
            </span>
            <span className='user-message__text'>{data.content}</span>
          </div>
        </div>
      )}
    </>
  );
}
