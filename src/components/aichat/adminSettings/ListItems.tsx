import React, { useState } from "react";
import { Tooltip, Popover } from "antd";
import { IoMdCheckmark, IoMdCopy } from "react-icons/io";
import { RiMore2Line } from "react-icons/ri";
import "./index.scss";
import { shortenAddress } from "../../../utils/index.ts";
import { FaAnglesDown, FaAnglesUp } from "react-icons/fa6";
import { IoMicOffOutline, IoMicOutline } from "react-icons/io5";
import socket from "../../../services/socket.ts";
import NotificationMessage from "../../common/notificationMessage.tsx";
import { InstanceData } from "../index.tsx";
import {
  addModeratorToChatInstance,
  removeModeratorFromChatInstance,
} from "../../../services/api.ts";

interface ListItemsProps {
  currentView: string;
  listData: any[];
  setListData: React.Dispatch<
    React.SetStateAction<{ address: string; type: string }[]>
  >;
  mutedUsers: string[];
  isLoading: boolean;
  copiedIndex: number | null;
  setCopiedIndex: (index: number | null) => void;
  instanceData: InstanceData;
  address: string;
}

const ListItems: React.FC<ListItemsProps> = ({
  currentView,
  listData,
  setListData,
  mutedUsers,
  isLoading,
  copiedIndex,
  setCopiedIndex,
  instanceData,
  address,
}) => {
  return (
    <div className='listItems'>
      <h4>
        {currentView.charAt(0).toUpperCase() + currentView.slice(1)} (
        {listData?.length})
      </h4>

      {isLoading
        ? [1, 2, 3, 4].map((_, i) => (
            <div className='messageLoader skeleton' key={i}></div>
          ))
        : listData?.map((item: any, index: number) => (
            // <div className='listItem' key={index}>
            //   <img
            //     src={`https://effigy.im/a/${item?.address}.svg`}
            //     alt={`icon`}
            //     className='userIcon'
            //   />
            //   <p>{shortenAddress(item?.address)} </p>
            //   <Tooltip
            //     placement='top'
            //     title={copiedIndex === index ? "Copied!" : "Copy Address"}
            //   >
            //     {copiedIndex === index ? (
            //       <IoMdCheckmark size={16} className='copyIcon checked' />
            //     ) : (
            //       <IoMdCopy
            //         style={{ cursor: "pointer" }}
            //         size={16}
            //         onClick={() => copyToClipboard(item?.address, index)}
            //         className='copyIcon'
            //       />
            //     )}
            //   </Tooltip>
            //   <p className='type'>{item?.type}</p>
            //   {item?.address !== instanceData?.adminAddress && (
            //     <Popover
            //       content={content(item)}
            //       placement='bottomRight'
            //       trigger='click'
            //       arrow={false}
            //       open={isPopoverVisible}
            //       onOpenChange={(visible) =>
            //         handlePopoverVisibleChange(visible, item?.address)
            //       }
            //     >
            //       <RiMore2Line />
            //     </Popover>
            //   )}
            // </div>
            <ListItem
              key={index}
              item={item}
              index={index}
              copiedIndex={copiedIndex}
              setCopiedIndex={setCopiedIndex}
              instanceData={instanceData}
              setListData={setListData}
              mutedUsers={mutedUsers}
            />
          ))}
    </div>
  );
};

export default ListItems;

interface ListItemProps {
  item: { address: string; type: string };
  index: number;
  copiedIndex: number | null;
  setCopiedIndex: any;
  instanceData: InstanceData;
  mutedUsers: string[];
  setListData: any;
}

const ListItem: React.FC<ListItemProps> = ({
  item,
  index,
  copiedIndex,
  setCopiedIndex,
  instanceData,
  mutedUsers,
  setListData,
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isPopoverVisible, setIsPopoverVisible] = useState(false);

  const handlePopoverVisibleChange = (
    visible: boolean,
    currentAddress: string
  ) => {
    setIsPopoverVisible(visible);
    if (visible) {
      setIsMuted(mutedUsers?.includes(currentAddress));
    }
  };
  const copyToClipboard = (address: string, index: number) => {
    navigator.clipboard.writeText(address).then(() => {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    });
  };

  const handleMute = (address: string) => {
    socket.emit(
      "muteUser",
      { walletAddress: address, instanceId: instanceData?.id },
      (response: any) => {
        if (response.success) {
          setListData((prev: any[]) =>
            prev.filter((item: { address: string }) => item.address !== address)
          );
          NotificationMessage("success", "User is Muted");
          setIsPopoverVisible(false);
        } else {
          NotificationMessage("error", response.error.message);
        }
      }
    );
  };

  const handleUnmute = (address: string) => {
    socket.emit(
      "unmuteUser",
      { walletAddress: address, instanceId: instanceData?.id },
      (response: any) => {
        if (response.success) {
          setListData((prev: any[]) =>
            prev.filter((item: { address: string }) => item.address !== address)
          );
          NotificationMessage("success", "User is Unmuted");
          setIsPopoverVisible(false);
        } else {
          NotificationMessage("error", response.error.message);
        }
      }
    );
  };

  const handlePromote = async (address: string) => {
    try {
      const payload = {
        admin: instanceData?.adminAddress,
        moderators: address,
        instanceId: instanceData?.id,
      };
      await addModeratorToChatInstance(payload);
      NotificationMessage("success", "User promoted to Moderator!");
      setListData((prev: any) =>
        prev.map((user: any) =>
          user.address === address ? { ...user, type: "Moderator" } : user
        )
      );
    } catch (error) {
      console.error(error);
      NotificationMessage("error", "Failed to promote user.");
    }
  };

  const handleDemote = async (address: string) => {
    try {
      const payload = {
        admin: instanceData?.adminAddress,
        moderators: address,
        instanceId: instanceData?.id,
      };
      await removeModeratorFromChatInstance(payload);
      NotificationMessage("success", "User demoted to Member!");
      setListData((prev: any) =>
        prev.map((user: any) =>
          user.address === address ? { ...user, type: "Member" } : user
        )
      );
    } catch (error) {
      console.error("Demotion failed:", error);
      NotificationMessage("error", "Failed to demote user.");
    }
  };

  const content = (item: any) => (
    <section className='popover_container' role='menu'>
      {item?.type === "Member" && (
        <div
          onClick={() => handlePromote(item.address)}
          className='popover_item'
        >
          <FaAnglesUp /> <span>Promote to MOD</span>
        </div>
      )}
      {item?.type === "Moderator" && (
        <div
          onClick={() => handleDemote(item.address)}
          className='popover_item'
        >
          <FaAnglesDown /> <span>Demote to Member</span>
        </div>
      )}
      {isMuted ? (
        <div
          onClick={() => handleUnmute(item.address)}
          className='popover_item'
        >
          <IoMicOutline /> <span>Unmute</span>
        </div>
      ) : (
        <div onClick={() => handleMute(item.address)} className='popover_item'>
          <IoMicOffOutline /> <span>Mute</span>
        </div>
      )}
    </section>
  );
  return (
    <div className='listItem' key={index}>
      <img
        src={`https://effigy.im/a/${item?.address}.svg`}
        alt={`icon`}
        className='userIcon'
      />
      <p>{shortenAddress(item?.address as `0x${string}`)} </p>
      <Tooltip
        placement='top'
        title={copiedIndex === index ? "Copied!" : "Copy Address"}
      >
        {copiedIndex === index ? (
          <IoMdCheckmark size={16} className='copyIcon checked' />
        ) : (
          <IoMdCopy
            style={{ cursor: "pointer" }}
            size={16}
            onClick={() => copyToClipboard(item?.address, index)}
            className='copyIcon'
          />
        )}
      </Tooltip>
      <p className='type'>{item?.type}</p>
      {item?.address !== instanceData?.adminAddress && (
        <Popover
          content={content(item)}
          placement='bottomRight'
          trigger='click'
          arrow={false}
          open={isPopoverVisible}
          onOpenChange={(visible) =>
            handlePopoverVisibleChange(visible, item?.address)
          }
        >
          <RiMore2Line />
        </Popover>
      )}
    </div>
  );
};
