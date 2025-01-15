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

function App() {
  const isOnline = useOnlineStatus();
  const { isConnected, address } = useAccount();
  useEffect(() => {
    if (isConnected) {
      socket.on("connect", () => {
        console.log("Connected:", socket.id);
        socket.emit("join", "0x99A221a87b3C2238C90650fa9BE0F11e4c499D06");
        // const res = socket.emit("join", address);
        // console.log("CONNECTED", res);
      });
    }
  }, [isConnected]);

  return (
    <div className='dark'>
      <Navbar />
      {/* <TokenDetails /> */}
      <AgentList />
      <Footer />
    </div>
  );
}

export default App;
