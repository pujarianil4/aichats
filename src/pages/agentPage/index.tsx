import { useEffect, useRef, useState } from "react";
import AiChats from "../../components/aichat/index.tsx";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import {
  connectAddress,
  getChatInstanceWithAgentId,
} from "../../services/api.ts";
import { useAccount } from "wagmi";
import socket from "../../services/socket.ts";

interface InstanceData {
  id: number;
  name: string;
  adminAddress: string;
  moderators: string[];
  tokenAddress: string;
  streamUrl: string;
  aId: string;
  minTokenValue: string;
  createdAt: string;
}

export default function AgentPage() {
  const navigate = useNavigate();
  const { agentId } = useParams();

  const { address, isConnected } = useAccount();
  const wasConnected = useRef(false);
  const [instanceData, setInstanceData] = useState<InstanceData>();

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

  useEffect(() => {
    if (isConnected && instanceData?.id) {
      socket.on("connect", () => {
        console.log("Connected:", socket.id);
        socket.emit("join", {
          walletAddress: address,
          instanceId: instanceData?.id,
        });
      });
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

  const handleSetChat = () => {
    navigate("/agent/create-chat-instance");
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
  return (
    <main>
      AgentPage
      <button onClick={handleSetChat}>Set Live Chat</button>
      {instanceData?.id && (
        <AiChats
          youtubeLink={instanceData?.streamUrl}
          // youtubeLink='https://www.youtube.com/embed/1mwjOdC4Si8'
          adminAddress={instanceData?.adminAddress}
          tokenAddress={instanceData?.tokenAddress}
          chatInstanceId={instanceData?.id}
        />
      )}
    </main>
  );
}
