import { useMemo, useState } from "react";
import "./index.scss";
import adminLogo from "../../../assets/admin.svg";
import membersLogo from "../../../assets/members.svg";
import muteLogo from "../../../assets/mutedUsers.svg";
import { MdKeyboardArrowRight } from "react-icons/md";
import {
  getAllUsersbyInstanceId,
  getMutedUsersWithInstanceId,
} from "../../../services/api.ts";
import { IoIosArrowRoundBack } from "react-icons/io";
import { Flex, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useAccount } from "wagmi";

import MutedList from "./MutedList.tsx";
import ListItems from "./ListItems.tsx";
import { InstanceData } from "../publicChat/index.tsx";

interface CachedData {
  data: string[];
  lastFetched: number;
}

interface IProps {
  instanceData: InstanceData;
  updateStreamUrl: (youtubeLink: string, minTokenValue: string) => void;
  setIsSettings: (value: boolean) => void;
  mutedUsers: string[];
}
export default function ChatAdminSettings({
  instanceData,
  updateStreamUrl,
  setIsSettings,
  mutedUsers,
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
      } else if (type === "members") {
        const res = await getAllUsersbyInstanceId(instanceData?.id);
        const memberData = res?.map((item: any) => ({
          address: item?.address,
          type: "Member",
        }));
        const adminAddresses = admins.map((admin) => admin.address);
        response = [
          ...admins,
          ...memberData.filter(
            (member: any) => !adminAddresses.includes(member.address)
          ),
        ];
      } else if (type === "muted") {
        const res = await getMutedUsersWithInstanceId(instanceData?.id);
        response = res?.map((item: any) => ({
          address: item?.walletAddress,
          mutedAt: item?.mutedAt,
        }));
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

      {(currentView === "admin" || currentView === "members") && !isLoading && (
        <ListItems
          currentView={currentView}
          listData={listData}
          setListData={setListData}
          mutedUsers={mutedUsers}
          isLoading={isLoading}
          copiedIndex={copiedIndex}
          setCopiedIndex={setCopiedIndex}
          instanceData={instanceData}
          address={address as string}
        />
      )}

      {currentView === "muted" && !isLoading && (
        <MutedList
          listData={listData}
          copiedIndex={copiedIndex}
          setCopiedIndex={setCopiedIndex}
          instanceData={instanceData}
        />
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
              <button onClick={updateChatInstance}>update</button>
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
