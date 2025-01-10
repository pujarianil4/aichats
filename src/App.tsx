import "./App.scss";
import "./styles/index.scss";
import AiChats from "./components/aichat/index.js";
import Navbar from "./components/navbar/index.tsx";
import useOnlineStatus from "./hooks/useOnlineStatus.js";
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
    <>
      <Navbar />
      <AiChats
        youtubeLink='https://www.youtube.com/embed/1mwjOdC4Si8'
        address=''
      />
    </>
  );
}

export default App;
