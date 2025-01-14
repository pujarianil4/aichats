import "./App.scss";
import "./styles/index.scss";
import AiChats from "./components/aichat/index.js";
import Navbar from "./components/navbar/index.tsx";
import useOnlineStatus from "./hooks/useOnlineStatus.js";
import { useEffect } from "react";
import socket from "./services/socket.ts";
import { useAccount } from "wagmi";
import ChatInstanceForm from "./components/chatInstanceForm/index.tsx";

function App() {
  const isOnline = useOnlineStatus();
  const { isConnected, address } = useAccount();
  useEffect(() => {
    if (isConnected) {
      socket.on("connect", () => {
        console.log("Connected:", socket.id);
        socket.emit("join", "0xD5b26AC46d2F43F4d82889f4C7BBc975564859e3");
        // const res = socket.emit("join", address);
        // console.log("CONNECTED", res);
      });
    }
  }, [isConnected]);

  return (
    <>
      <Navbar />
      <ChatInstanceForm />
      <AiChats
        youtubeLink='https://www.youtube.com/embed/1mwjOdC4Si8'
        address=''
      />
    </>
  );
}

export default App;
