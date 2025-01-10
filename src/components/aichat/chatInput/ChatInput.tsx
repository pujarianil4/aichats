import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import "./chatinput.scss";
import socket from "../../../services/socket.ts";

import { BsEmojiSmile } from "react-icons/bs";

import sendIcon from "../../../assets/send.svg";
import dollarIcon from "../../../assets/dollar.svg";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { erc20Abi } from "../../../helpers/contracts/abi.ts";
import { parseUnits } from "viem";
import TipPopup from "./TipPanel.tsx";
import { connectAddress } from "../../../services/api.ts";

export default function ChatInput() {
  const { isConnected, address } = useAccount();
  const [message, setMessage] = useState("");
  const [showTipPopup, setShowTipPopup] = useState(false);
  const [customAmount, setCustomAmount] = useState("");
  const sushiTokenAddress = "0x0b3F868E0BE5597D5DB7fEB59E1CADBb0fdDa50a";
  const superChatAdminAddress = "0xe80fe9b925F2717047e6f0CcF2A82367bdDf2219";

  // Transaction hash and status
  const { data: hash, isPending, writeContract } = useWriteContract();

  const { isLoading, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (isConfirmed && message.trim() !== "") {
      const updateText = `Send 10 UFT Token ${message}`;
      if (updateText) {
        // socket.emit("chatMessage", {
        //   message: updateText,
        //   timestamp: new Date().toISOString(),
        // });
        socket.emit("message", {
          content: message,
          hash: "skdjFGjhghaeiwuyiewh",
          amnt: 100,
        });
        setMessage("");
        setCustomAmount("");
      }
    }
  }, [isConfirmed]);

  const handleSend = async () => {
    //connectAddress
    if (address)
      if (customAmount) {
        // await connectAddress("0x99A221a87b3C2238C90650fa9BE0F11e4c499D06");
        console.log("Sending tip...");
        await writeContract({
          address: sushiTokenAddress,
          abi: erc20Abi,
          functionName: "transfer",
          args: [superChatAdminAddress, parseUnits(customAmount, 18)],
        });
      } else if (message.trim() !== "") {
        // socket.emit("chatMessage", {
        //   message: message,
        //   timestamp: new Date().toISOString(),
        // });
        socket.emit("message", { content: message });
        setMessage("");
      }
  };

  return (
    <div className='chatinputContainer'>
      {showTipPopup && (
        <TipPopup
          customAmount={customAmount}
          setCustomAmount={setCustomAmount}
        />
      )}

      <div className='inputs'>
        <input
          type='text'
          className='input_text'
          placeholder='Send a Message'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
        />
        {/* <EmojiPicker setEmoji={handleEmojiPicker} /> */}

        <div
          className='tip_btn'
          onClick={() => setShowTipPopup((prev) => !prev)}
        >
          <img src={dollarIcon} alt='Tip' />
        </div>

        <div className='emoji'>
          <BsEmojiSmile color='#fff' />
        </div>

        {isConnected ? (
          <div className='send_btn' onClick={() => handleSend()}>
            <img src={sendIcon} alt='Send' />
          </div>
        ) : (
          <ConnectButton />
        )}
      </div>
    </div>
  );
}
