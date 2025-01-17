import { useEnsName } from "wagmi";
import SuerChatMessage from "../superChat/index.tsx";
import "./index.scss";
import moreIcon from "../../../assets/more.svg";
import socket from "../../../services/socket.ts";
import { useState } from "react";
import { Popover } from "antd";
import NotificationMessage from "../../common/notificationMessage.tsx";

interface UserMessageProps {
  data: any;
  instance: number;
  isAdmin: boolean;
  onDeleteMessage: (messageId: number) => void;
}

export const shortenAddress = (address: string, chars: number = 5) =>
  address &&
  `${address.slice(0, chars)}....${address.slice(address.length - chars)}`;

export default function UserMessage({
  data,
  instance,
  isAdmin,
  onDeleteMessage,
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

  const handleDelete = () => {
    // socket.emit("deleteMessage", { messageId: data?.id, instanceId: instance });
    socket.emit(
      "deleteMessage",
      { messageId: data?.id, instanceId: instance },
      (response: any) => {
        if (response.success) {
          onDeleteMessage(data?.id);
        } else {
          console.error("Failed to delete message:", response.error);
          NotificationMessage("error", response.error.message);
        }
      }
    );
    onDeleteMessage(data?.id);
  };

  const content = (
    <section className='popover_content'>
      <div onClick={handleMute} className='popover_item'>
        Mute
      </div>
      <div onClick={handleDelete} className='popover_item'>
        Delete
      </div>
    </section>
  );

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
        <div className='user-message-container'>
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
              <span
                className={`user-message__name ${isAdmin ? "adminUser" : ""}`}
              >
                {!ensName ? shortenAddress(data.senderAddress) : ensName}:
              </span>
              <span className='user-message__text'>{data.content}</span>
            </div>
          </div>
          {isAdmin && (
            <div className='more'>
              <Popover
                content={content}
                placement='bottomRight'
                // title='Title'
                trigger='click'
                arrow={false}
              >
                <img src={moreIcon} alt='more' />
              </Popover>
            </div>
          )}
        </div>
      )}
    </>
  );
}
