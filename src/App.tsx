import "./App.scss";
import "./styles/index.scss";
import AiChats from "./components/aichat/index.js";
import Navbar from "./components/navbar/index.tsx";
import useOnlineStatus from "./hooks/useOnlineStatus.js";
import TradingViewChart from "./components/Charts/TradingViewChart.tsx";
import DextoolsWidget from "./components/Charts/Dex.tsx";
import GeckoChart from "./components/Charts/GeckoChart.tsx";
import { TokenDetails } from "./components/tokenDeatils/index.tsx";
import AgentList from "./components/AgentList/index.tsx";
import Footer from "./components/footer/index.tsx";
import { useEffect } from "react";
import socket from "./services/socket.ts";
import { useAccount } from "wagmi";
import ChatInstanceForm from "./components/chatInstanceForm/index.tsx";

function App() {
  const isOnline = useOnlineStatus();
  const { isConnected, address } = useAccount();
  const path = window.location.pathname;
  const param = path.split("/")[1];
  useEffect(() => {
    if (isConnected) {
      socket.on("connect", () => {
        console.log("Connected:", socket.id);
        // socket.emit("join", "0xD5b26AC46d2F43F4d82889f4C7BBc975564859e3");
        socket.emit("join", {
          walletAddress: address,
          instanceId: +param,
        });
        // const res = socket.emit("join", address);
        // console.log("CONNECTED", res);
      });
    }
  }, [isConnected]);

  return (
    <div className='dark'>
      <Navbar />
      {/* <ChatInstanceForm /> */}
      <AiChats
        youtubeLink='https://www.youtube.com/embed/1mwjOdC4Si8'
        address=''
      />
      {/* <TokenDetails /> */}
      <AgentList />
      <Footer />
    </div>
  );
}

export default App;
