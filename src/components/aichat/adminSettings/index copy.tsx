import { useMemo, useState } from "react";
import "./index.scss";
import adminLogo from "../../../assets/admin.svg";
import membersLogo from "../../../assets/members.svg";
import muteLogo from "../../../assets/mutedUsers.svg";
import { MdKeyboardArrowRight } from "react-icons/md";
import { InstanceData } from "../index.tsx";
import {
  addModeratorToChatInstance,
  getAllUsersbyInstanceId,
  getMutedUsersWithInstanceId,
  removeModeratorFromChatInstance,
} from "../../../services/api.ts";
import { IoIosArrowRoundBack, IoMdCheckmark, IoMdCopy } from "react-icons/io";
import { formatTimeDifference, shortenAddress } from "../../../utils/index.ts";
import socket from "../../../services/socket.ts";
import NotificationMessage from "../../common/notificationMessage.tsx";
import { Flex, Popover, Spin, Tooltip } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useAccount } from "wagmi";
import { RiMore2Line } from "react-icons/ri";
import { FaAnglesDown, FaAnglesUp } from "react-icons/fa6";
import { IoMicOffOutline, IoMicOutline } from "react-icons/io5";

// handle delete user bug
// handle responsiveness for mobile and tab

interface CachedData {
  data: string[];
  lastFetched: number;
}

interface IProps {
  instanceData: InstanceData;
  updateStreamUrl: (youtubeLink: string, minTokenValue: string) => void;
  setIsSettings: (value: boolean) => void;
}
export default function ChatAdminSettings({
  instanceData,
  updateStreamUrl,
  setIsSettings,
}: IProps) {
  const { address } = useAccount();
  const [minAmount, setMinAmount] = useState("");
  const [youtubeLink, setYoutubeLink] = useState("");
  const [currentView, setCurrentView] = useState<
    "menu" | "admin" | "members" | "muted" | "chats"
  >("menu");
  const [listData, setListData] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [isPopoverVisible, setIsPopoverVisible] = useState(false);
  const isAdmin = useMemo(() => {
    return address === instanceData?.adminAddress;
  }, []);

  const cache: Record<string, CachedData> = {};

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      if (value.startsWith(".")) {
        value = "0" + value;
      }
      setMinAmount(value);
    }
  };

  const handleUpdateLink = (event: React.ChangeEvent<HTMLInputElement>) => {
    setYoutubeLink(event.target.value);
  };

  const updateChatInstance = () => {
    updateStreamUrl(
      youtubeLink || instanceData?.streamUrl,
      minAmount || instanceData?.minTokenValue
    );
    setMinAmount("");
    setYoutubeLink("");
  };

  const copyToClipboard = (address: string, index: number) => {
    navigator.clipboard.writeText(address).then(() => {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    });
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

  const fetchData = async (type: string) => {
    const currentTime = Date.now();

    // Check if data is already cached and within the 2-minute interval
    if (cache[type] && currentTime - cache[type].lastFetched < 2 * 60 * 1000) {
      setListData(cache[type].data);
      return;
    }

    try {
      setIsLoading(true);
      let response: string[] = [];
      let admins: any[] = [
        { address: instanceData?.adminAddress, type: "Admin" },
      ];
      instanceData.moderators?.forEach((item) =>
        admins.push({ address: item, type: "Moderator" })
      );
      if (type === "admin") {
        response = admins;
        console.log("ADMIN_RES", response);
      } else if (type === "members") {
        const res = await getAllUsersbyInstanceId(instanceData?.id);
        const memberData = res?.map((item: any) => ({
          address: item?.address,
          type: "Member",
        }));
        // response = [...admins, ...memberData];
        const adminAddresses = admins.map((admin) => admin.address);
        response = [
          ...admins,
          ...memberData.filter(
            (member: any) => !adminAddresses.includes(member.address)
          ),
        ];
        console.log("MEMBERS_RES", response);
      } else if (type === "muted") {
        const res = await getMutedUsersWithInstanceId(instanceData?.id);
        response = res?.map((item: any) => ({
          address: item?.walletAddress,
          mutedAt: item?.mutedAt,
        }));
        console.log("MUTED_RES_1", response);
      }
      cache[type] = { data: response, lastFetched: currentTime };
      setListData(response);
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  const viewList = (type: "admin" | "members" | "muted") => {
    fetchData(type);
    setCurrentView(type);
  };

  const handleBack = () => {
    if (currentView === "menu") {
      setCurrentView("chats");
      setIsSettings(false);
    } else {
      setCurrentView("menu");
    }
  };

  const handleMute = (address: string) => {
    socket.emit(
      "unmuteUser",
      {
        walletAddress: address,
        instanceId: instanceData?.id,
      },
      (response: any) => {
        if (response.success) {
          listData?.filter((item: any) => item != address);
        } else {
          console.error("Failed to unmute:", response.error);
          NotificationMessage("error", response.error.message);
        }
      }
    );
  };

  const handleUnmute = (address: string) => {
    socket.emit(
      "unmuteUser",
      {
        walletAddress: address,
        instanceId: instanceData?.id,
      },
      (response: any) => {
        if (response.success) {
          listData?.filter((item: any) => item != address);
        } else {
          console.error("Failed to unmute:", response.error);
          NotificationMessage("error", response.error.message);
        }
      }
    );
  };

  const handlePopoverVisibleChange = (visible: boolean) => {
    setIsPopoverVisible(visible);
    // if (visible) {
    //   setIsMuted(mutedUsers?.includes(data.senderAddress));
    // }
  };

  const handleAction = (address, actionType) => {
    console.log("ACTION", address, actionType);
  };

  const content = (
    <section
      className='popover_container'
      role='menu'
      aria-label='User Actions'
    >
      {
        <div
          onClick={() => handleAction(address, actionType)}
          className='popover_item'
          role='menuitem'
          tabIndex={0}
        >
          <FaAnglesUp /> <span>Promote to MOD</span>
        </div>
      }
      <div className='popover_item' role='menuitem' tabIndex={1}>
        <FaAnglesDown /> <span>Demote to MOD</span>
      </div>
      <div className='popover_item' role='menuitem' tabIndex={2}>
        <IoMicOffOutline /> <span>Mute</span>
      </div>
      {/* <div className='popover_item' role='menuitem' tabIndex={3}>
        <IoMicOutline /> <span>Unmute</span>
      </div> */}
    </section>
  );

  return (
    <div className='chatSettingsContainer'>
      {currentView !== "chats" && (
        <div onClick={handleBack} className='backButton'>
          <IoIosArrowRoundBack size={32} />
        </div>
      )}

      {currentView === "menu" && (
        <div className='listSetting'>
          <h4>Settings</h4>
          <div
            role='button'
            onClick={() => viewList("admin")}
            className='menuItem'
          >
            <img src={adminLogo} alt='admin' />
            <p>Admin</p>
            <MdKeyboardArrowRight size={20} />
          </div>
          <div
            role='button'
            onClick={() => viewList("members")}
            className='menuItem'
          >
            <img src={membersLogo} alt='members' />
            <p>Members</p>
            <MdKeyboardArrowRight size={20} />
          </div>
          <div
            role='button'
            onClick={() => viewList("muted")}
            className='menuItem lastItem'
          >
            <img src={muteLogo} alt='muted' />
            <p>Muted Users</p>
            <MdKeyboardArrowRight size={20} />
          </div>
        </div>
      )}

      {isLoading && (
        <div className='noUserFound'>
          <Flex align='center' gap='middle'>
            <Spin
              indicator={
                <LoadingOutlined
                  color='#ff00b7'
                  style={{ fontSize: 48 }}
                  spin
                />
              }
            />
          </Flex>
        </div>
      )}

      {/* {isLoading && (
        <div className='noUserFound'>
          <img src={noUserFound} alt='No chat found' loading='lazy' />
        </div>
      )} */}

      {/* {listData?.length == 0 && (
        <div className='noUserFound'>
          <img src={noUserFound} alt='No chat found' loading='lazy' />
        </div>
      )} */}

      {(currentView === "admin" || currentView === "members") && !isLoading && (
        <div className='listItems'>
          <h4>
            {currentView.charAt(0).toUpperCase() + currentView.slice(1)} (
            {listData?.length})
          </h4>

          {isLoading
            ? [1, 2, 3, 4].map((_: any, i: number) => (
                <div className='messageLoader skeleton' key={i}></div>
              ))
            : listData?.map((item: any, index: number) => (
                <div className='listItem' key={index}>
                  <img
                    src={`https://effigy.im/a/${item?.address}.svg`}
                    alt={`icon`}
                    className='userIcon'
                  />
                  <p>{shortenAddress(item?.address)} </p>
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
                  <p className='type'>
                    {item?.type} &nbsp;
                    {/* {isAdmin && item?.type === "Member" && (
                      <Tooltip
                        placement='topLeft'
                        title='Promote as a Moderator'
                      >
                        <button
                          className='promoteButton'
                          onClick={() => handlePromote(item?.address)}
                        >
                          +
                        </button>
                      </Tooltip>
                    )}
                    {isAdmin && item?.type === "Moderator" && (
                      <Tooltip placement='topLeft' title='Demote as a Member'>
                        <button
                          className='demoteButton'
                          onClick={() => handleDemote(item?.address)}
                        >
                          -
                        </button>
                      </Tooltip>
                    )} */}
                  </p>
                  {item?.address != instanceData?.adminAddress && (
                    <Popover
                      content={content}
                      placement='bottomRight'
                      trigger='click'
                      arrow={false}
                      // open={isPopoverVisible}
                      // onOpenChange={handlePopoverVisibleChange}
                    >
                      <RiMore2Line />
                    </Popover>
                  )}
                </div>
              ))}
        </div>
      )}

      {currentView === "muted" && !isLoading && (
        <div className='listItems'>
          <h4>
            {currentView.charAt(0).toUpperCase() + currentView.slice(1)} (
            {listData?.length})
          </h4>
          {listData?.map((item: any, index: number) => (
            <div className='listItem' key={index}>
              <img
                src={`https://effigy.im/a/${item?.address}.svg`}
                alt={`icon`}
                className='userIcon'
              />
              <div>
                <div className='address'>
                  <p>{shortenAddress(item?.address)}</p>
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
                </div>
                <p className='muteTime'>
                  Muted: {formatTimeDifference(item?.mutedAt)}{" "}
                </p>
              </div>
              <button onClick={() => handleUnmute(item?.address)}>
                Unmute
              </button>
            </div>
          ))}
        </div>
      )}

      {currentView === "menu" && (
        <>
          <div className='tipSetting'>
            <h4>Tip Settings</h4>
            <div className='tipItem'>
              <p>Set Minimum Amount</p>
              <input
                placeholder='0'
                value={minAmount}
                onChange={handleChange}
              />
              <button onClick={updateChatInstance}>
                {/* <GrUpdate /> */}
                update
              </button>
            </div>
          </div>
          <div className='youtubeSetting'>
            <h4>Youtube Settings</h4>
            <input
              placeholder='update stream link'
              value={youtubeLink}
              onChange={handleUpdateLink}
            />
            <button onClick={updateChatInstance}>Update</button>
          </div>
        </>
      )}
    </div>
  );
}
