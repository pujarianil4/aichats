import { useState } from "react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import TipPanel from "./TipPanel";
import "./chatinput.scss";
import EmojiPicker from "../emoji/EmojiPicker.js";

export default function ChatInput() {
  const { isConnected } = useAccount();
  const [message, setMessage] = useState("");

  const superChatAdminAddress = "0xe80fe9b925F2717047e6f0CcF2A82367bdDf2219";

  const handleSendMessage = () => {
    console.log("Sending message:", message);
    setMessage("");
  };

  const handleEmojiPicker = (emoji: any) => {
    setMessage(message + emoji);
  };

  return (
    <div className='chatinputContainer'>
      <TipPanel recipient={superChatAdminAddress} />
      <div className='inputs'>
        <input
          type='text'
          className='input_text'
          placeholder='Type Something...'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <EmojiPicker setEmoji={handleEmojiPicker} />

        {isConnected ? (
          <button onClick={handleSendMessage}>Send</button>
        ) : (
          <ConnectButton />
        )}
      </div>
    </div>
  );
}
