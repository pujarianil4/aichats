import { useState } from "react";
import "./index.scss";
import adminLogo from "../../../assets/admin.svg";
import membersLogo from "../../../assets/members.svg";
import muteLogo from "../../../assets/mutedUsers.svg";
import { MdKeyboardArrowRight } from "react-icons/md";
import { GrUpdate } from "react-icons/gr";
import { InstanceData } from "../index.tsx";
import {
  getAllUsersbyInstanceId,
  getMutedUsersWithInstanceId,
} from "../../../services/api.ts";
import { IoIosArrowRoundBack, IoMdCheckmark, IoMdCopy } from "react-icons/io";
import { formatTimeDifference, shortenAddress } from "../../../utils/index.ts";
import socket from "../../../services/socket.ts";
import NotificationMessage from "../../common/notificationMessage.tsx";
import { Flex, Spin, Tooltip } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

// if muted then not allow to super chat
// update moderator status.
// handle logic for moderator
// handle delete user bug
// handle responsiveness for mobile and tab

interface CachedData {
  data: string[];
  lastFetched: number;
}

interface IProps {
  instanceData: InstanceData;
  updateStreamUrl: (youtubeLink: string, minTokenValue: string) => void;
}
export default function ChatAdminSettings({
  instanceData,
  updateStreamUrl,
}: IProps) {
  const [minAmount, setMinAmount] = useState("");
  const [youtubeLink, setYoutubeLink] = useState("");
  const [currentView, setCurrentView] = useState<
    "menu" | "admin" | "members" | "muted"
  >("menu");
  const [listData, setListData] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

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
        response = [...admins, ...memberData];
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
    setCurrentView("menu");
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
          listData?.filter((item) => item != address);
        } else {
          console.error("Failed to unmute:", response.error);
          NotificationMessage("error", response.error.message);
        }
      }
    );
  };
  return (
    <div className='chatSettingsContainer'>
      {currentView !== "menu" && (
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
          <h4>{currentView.charAt(0).toUpperCase() + currentView.slice(1)}</h4>

          {isLoading
            ? [1, 2, 3, 4].map((_: any, i: number) => (
                <div className='messageLoader skeleton' key={i}></div>
              ))
            : listData?.map((item: any, index) => (
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
                  <p className='type'>{item?.type}</p>
                </div>
              ))}
        </div>
      )}

      {currentView === "muted" && !isLoading && (
        <div className='listItems'>
          <h4>{currentView.charAt(0).toUpperCase() + currentView.slice(1)}</h4>
          {[...listData, ...listData]?.map((item: any, index) => (
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
                  Muted at: {formatTimeDifference(item?.mutedAt)}{" "}
                </p>
              </div>
              <button onClick={() => handleUnmute(item?.address)}>
                unmute
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
              <div role='button' onClick={updateChatInstance}>
                <GrUpdate />
              </div>
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
