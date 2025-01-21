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
  adminAddress: string;
  isAdmin: boolean;
  onDeleteMessage: (messageId: number) => void;
}

export const shortenAddress = (address: string, chars: number = 5) =>
  address &&
  `${address.slice(0, chars)}....${address.slice(address.length - chars)}`;

export default function UserMessage({
  data,
  instance,
  adminAddress,
  isAdmin,
  onDeleteMessage,
}: UserMessageProps) {
  const { data: ensName, isLoading: isEnsNameLoading } = useEnsName({
    address: data.senderAddress,
  });
  const [isMuted, setIsMuted] = useState(false);
  const [isPopoverVisible, setIsPopoverVisible] = useState(false);

  const tempMuteList = [
    "0xD5b26AC46d2F43F4d82889f4C7BBc975564859e3",
    "0x79821a0F47e0c9598413b12FE4882b33326B0cF8",
  ];

  const handlePopoverVisibleChange = (visible: boolean) => {
    setIsPopoverVisible(visible);
    if (visible) {
      setIsMuted(tempMuteList.includes(data.senderAddress));
    }
  };

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
        {isMuted ? "Unmute" : "Mute"}
      </div>
      <div onClick={handleDelete} className='popover_item'>
        Delete
      </div>
    </section>
  );

  return (
    <>
      {data?.amnt ? (
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
              <span
                className={`user-message__name ${
                  adminAddress === data.senderAddress ? "adminUser" : ""
                }`}
              >
                {!ensName ? shortenAddress(data.senderAddress) : ensName}:
              </span>
              <span className='user-message__text'>{data.content}</span>
            </div>
          </div>
          {adminAddress != data.senderAddress && isAdmin && (
            <div className='more'>
              <Popover
                content={content}
                placement='bottomRight'
                trigger='click'
                arrow={false}
                open={isPopoverVisible}
                onOpenChange={handlePopoverVisibleChange}
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
