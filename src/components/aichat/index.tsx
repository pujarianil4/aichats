import { useEffect, useRef, useState } from "react";
import ChatFeed from "./chatfeed/ChatFeed.js";
import ChatInput from "./chatInput/ChatInput.js";
import { Modal, Input, Button, Switch } from "antd";
import "./index.scss";
import YoutubeVideo from "./youtubeVideo/index.tsx";
import { useAccount } from "wagmi";
import socket from "../../services/socket.ts";
import {
  connectAddress,
  getChatInstanceWithAgentId,
  updateChatInstance,
} from "../../services/api.ts";
import { useParams } from "react-router-dom";
import { erc20Abi } from "../../helpers/contracts/abi.ts";
import { multicall } from "wagmi/actions";
import { wagmiConfig } from "../../main.tsx";
import NotificationMessage from "../common/notificationMessage.tsx";
import { MdOutlineFeaturedVideo } from "react-icons/md";
import ChatAdminSettings from "./adminSettings/index.tsx";

export interface InstanceData {
  id: number;
  name: string;
  adminAddress: string | `0x${string}`;
  moderators: string[];
  tokenAddress: string | `0x${string}`;
  streamUrl: string;
  aId: string;
  minTokenValue: string;
  createdAt: string;
}
export default function AiChats() {
  // const navigate = useNavigate();
  const { agentId } = useParams();
  const { address, isConnected, chainId } = useAccount();
  const [viewSize, setViewSize] = useState(0);
  const [direction, setDirection] = useState<"up" | "down">("up");
  // const apiKey = import.meta.env;
  const wasConnected = useRef(false);
  const [instanceData, setInstanceData] = useState<InstanceData>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [youtubeLink, setYoutubeLink] = useState("");
  const [isSetting, setIsSettings] = useState(true);

  useEffect(() => {
    if (instanceData?.id) {
      if (!wasConnected.current && isConnected) {
        handleWalletConnected(address!);
      }
      wasConnected.current = isConnected;
      if (!isConnected) {
        sessionStorage.setItem("isAdmin", "false");
      }
    }
  }, [isConnected, address, instanceData?.id]);

  const getTokenDetails = async () => {
    // Fetch token symbol
    // const symbol = await readContract({
    //   address: instanceData?.tokenAddress,
    //   abi: erc20Abi,
    //   functionName: "symbol",
    //   chainId: 1,
    // });

    // // Fetch token decimals
    // const decimals = await readContract({
    //   address: instanceData?.tokenAddress,
    //   abi: erc20Abi,
    //   functionName: "decimals",
    // });
    const results = await multicall(wagmiConfig, {
      contracts: [
        {
          address: instanceData?.tokenAddress as `0x${string}`,
          abi: erc20Abi as any,
          functionName: "symbol",
        },
        {
          address: instanceData?.tokenAddress as `0x${string}`,
          abi: erc20Abi,
          functionName: "decimals",
        },
      ],
      chainId: chainId,
    });
    localStorage.setItem(
      "tokenData",
      JSON.stringify({ symbol: results[0].result, decimals: results[1].result })
    );
  };

  useEffect(() => {
    if (isConnected && instanceData?.id) {
      socket.on("connect", () => {
        console.log("Connected:", socket.id);
        socket.emit("join", {
          walletAddress: address,
          instanceId: instanceData?.id,
        });
      });
      getTokenDetails();
    }
  }, [isConnected, instanceData?.id]);

  const handleWalletConnected = async (connectedAddress: string) => {
    try {
      await connectAddress(connectedAddress, instanceData?.id);
      const isAdmin = instanceData?.adminAddress === connectedAddress;
      sessionStorage.setItem("isAdmin", JSON.stringify(isAdmin));
    } catch (error) {
      console.error("Connect Address Error", error);
    }
  };

  const getInstanceData = async () => {
    try {
      const data = await getChatInstanceWithAgentId(agentId as string);
      setInstanceData(data);
    } catch (error) {
      console.error("Chat Instance Error", error);
    }
  };

  useEffect(() => {
    getInstanceData();
  }, []);

  const handleViewSizeChange = () => {
    setViewSize((prev: number) => {
      if (direction === "up") {
        if (prev === 2) {
          setDirection("down");
          return 1;
        }
        return prev + 1;
      } else {
        if (prev === 0) {
          setDirection("up");
          return 1;
        }
        return prev - 1;
      }
    });
  };

  const updateStreamUrl = async (
    youtubeLink: string,
    minTokenValue: string
  ) => {
    try {
      await updateChatInstance(
        youtubeLink,
        minTokenValue,
        instanceData?.id as number
      );
      NotificationMessage("success", "Chat Instance Updated Successfully!");
      setInstanceData((prev: any) => ({
        ...prev,
        streamUrl: youtubeLink,
      }));
      setIsModalOpen(false);
    } catch (error: any) {
      console.error("Stream URL update error", error);
      NotificationMessage("error", error?.message);
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setYoutubeLink("");
  };

  const dynamicStyles =
    viewSize === 0
      ? { width: "892px" }
      : viewSize === 1
      ? { width: "446px" }
      : { width: "164px", height: "288px" };

  if (!instanceData?.id) {
    return null;
  }

  return (
    <div style={dynamicStyles} className='aichats'>
      <div
        className={`actions ${viewSize === 0 ? "full" : "half"}`}
        onClick={handleViewSizeChange}
      >
        <MdOutlineFeaturedVideo size={20} color='#ffffff' />
      </div>

      <div
        style={viewSize == 2 ? { width: "100%" } : { width: "446px" }}
        className='live'
      >
        <YoutubeVideo youtubeLink={instanceData?.streamUrl} />
        {instanceData?.adminAddress === address && (
          <div onClick={handleOpenModal} className='update'>
            update
          </div>
        )}
      </div>

      <div className='chatfeed'>
        <div>
          <Switch
            className='adminSettings'
            defaultChecked
            onChange={(checked) => setIsSettings(checked)}
          />
        </div>
        {isSetting ? (
          <ChatAdminSettings
            instanceData={instanceData}
            updateStreamUrl={updateStreamUrl}
          />
        ) : (
          <>
            <ChatFeed
              chatInstanceId={instanceData?.id}
              adminAddress={instanceData?.adminAddress}
            />
            <ChatInput
              adminAddress={instanceData?.adminAddress}
              tokenAddress={instanceData?.tokenAddress}
              chatInstanceId={instanceData?.id}
            />
          </>
        )}
      </div>
      <Modal
        title='Update YouTube Live Link'
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={[
          <Button key='cancel' onClick={handleCloseModal}>
            Cancel
          </Button>,
          <Button
            key='submit'
            type='primary'
            onClick={() =>
              updateStreamUrl(youtubeLink, instanceData?.minTokenValue)
            }
            disabled={!youtubeLink}
          >
            Update
          </Button>,
        ]}
      >
        <Input
          style={{ backgroundColor: "transparent" }}
          placeholder='Enter YouTube video link'
          value={youtubeLink}
          onChange={(e) => setYoutubeLink(e.target.value)}
        />
      </Modal>
    </div>
  );
}
