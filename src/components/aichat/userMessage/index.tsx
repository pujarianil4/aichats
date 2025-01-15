import { useEnsAvatar, useEnsName } from "wagmi";
import SuerChatMessage from "../superChat/index.tsx";
import { normalize } from "viem/ens";
import "./index.scss";
import socket from "../../../services/socket.ts";
import { useState } from "react";

interface UserMessageProps {
  data: any;
  instance: number;
  isAdmin: boolean;
}

export const shortenAddress = (address: string, chars: number = 5) =>
  address &&
  `${address.slice(0, chars)}....${address.slice(address.length - chars)}`;

export default function UserMessage({
  data,
  instance,
  isAdmin,
}: UserMessageProps) {
  const { data: ensName, isLoading: isEnsNameLoading } = useEnsName({
    address: data.senderAddress,
  });
  const [isMuted, setIsMuted] = useState(false);

  const handleMute = () => {
    if (isMuted) {
      socket.emit("muteUser", {
        walletAddress: data.senderAddress,
        instanceId: instance,
      });
    } else {
      socket.emit("unmuteUser", {
        walletAddress: data.senderAddress,
        instanceId: instance,
      });
    }
    setIsMuted((prev: boolean) => !prev);
  };

  return (
    <>
      {data?.amnt ? (
        // <div className='admin'>
        //   <img
        //     src={userIcon}
        //     alt={`${data.senderAddress}'s icon`}
        //     className='user-message__icon'
        //   />
        //   <div className='admin__content'>
        //     <span className='admin__name'>
        //       {shortenAddress(data.senderAddress)}:
        //     </span>
        //     <span className='admin__value'> ${data.amnt} </span>
        //     <div className='admin__text'>{data.content}</div>
        //   </div>
        // </div>
        <SuerChatMessage ensName={ensName} data={data} />
      ) : (
        <div className='user-message'>
          <img
            src={`https://effigy.im/a/${data.senderAddress}.svg`}
            alt={`${data.senderAddress}'s icon`}
            className='user-message__icon'
          />
          <div className='user-message__content'>
            {isAdmin && (
              <span style={{ cursor: "pointer" }} onClick={handleMute}>
                {isMuted ? "unmute" : "mute"}
              </span>
            )}
            <span className='user-message__name'>
              {!ensName ? shortenAddress(data.senderAddress) : ensName}:
            </span>
            <span className='user-message__text'>{data.content}</span>
          </div>
        </div>
      )}
    </>
  );
}
