import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import "./chatinput.scss";

import socket from "../../../services/socket.ts";
import { BsEmojiSmile } from "react-icons/bs";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { erc20Abi } from "../../../helpers/contracts/abi.ts";
import { parseUnits } from "viem";
import TipPopup from "./TipPanel.tsx";
import EmojiPicker from "../emoji/EmojiPicker.tsx";
// import { connectAddress } from "../../../services/api.ts";
// import EmojiPicker from "../emoji/EmojiPicker.tsx";

// adminAddress={adminAddress}
//           tokenAddress={tokenAddress}
//           chatInstanceId={chatInstanceId}

interface IProps {
  adminAddress: string;
  tokenAddress: string;
  chatInstanceId: number;
}

export default function ChatInput({
  adminAddress,
  tokenAddress,
  chatInstanceId,
}: IProps) {
  const { isConnected, address } = useAccount();
  const [message, setMessage] = useState("");
  const [showTipPopup, setShowTipPopup] = useState(false);
  const [customAmount, setCustomAmount] = useState("");
  // const sushiTokenAddress = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"; // USDC - BASE
  // const superChatAdminAddress = "0x79821a0F47e0c9598413b12FE4882b33326B0cF8";

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
          hash: hash,
          amnt: customAmount,
        });
        socket.emit("getSuperChat", { instanceId: chatInstanceId });
        setMessage("");
        setCustomAmount("");
        setShowTipPopup(false);
      }
    }
  }, [isConfirmed]);

  const handleSend = async () => {
    if (address)
      if (customAmount) {
        console.log("Sending tip...");
        await writeContract({
          address: tokenAddress,
          abi: erc20Abi,
          functionName: "transfer",
          args: [adminAddress, parseUnits(customAmount, 6)], // TODO: Update later
        });
      } else if (message.trim() !== "") {
        socket.emit("message", { content: message });
        setMessage("");
        setShowTipPopup(false);
      }
  };

  const handleEmoji = (emoji: any) => {
    setMessage(message + emoji);
  };

  return (
    <div className='chatinputContainer'>
      {showTipPopup && (
        <TipPopup
          customAmount={customAmount}
          setCustomAmount={setCustomAmount}
        />
      )}
      <div
        className={`gradient-border-button ${
          customAmount ? "input_gradeint" : ""
        }`}
      >
        <div
          className={`gradient-border-button__content ${
            customAmount ? "bg_normal" : ""
          }`}
        >
          {/* <div className={`inputs ${customAmount ? "input_gradeint" : ""}`}> */}
          <input
            type='text'
            className={`input_text ${customAmount ? "tipped" : ""}`}
            placeholder='Send a Message'
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
          />

          <div
            className={`tip_btn ${customAmount ? "active" : ""}`}
            onClick={() => setShowTipPopup((prev) => !prev)}
          >
            <span>
              <svg
                width='27'
                height='19'
                viewBox='0 0 27 19'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M0.937871 4.27539C0.937871 2.41379 2.44699 0.904667 4.30859 0.904667H22.1089C23.9705 0.904667 25.4797 2.41379 25.4797 4.27539V14.3671C25.4797 16.2287 23.9705 17.7378 22.1089 17.7378H4.30859C2.44699 17.7378 0.937871 16.2287 0.937871 14.3671V4.27539Z'
                  fill=''
                  stroke={customAmount ? "#28A745" : "white"}
                  stroke-width='1.25855'
                />
                <path
                  d='M12.9158 14.1809V5.02782H13.5022V14.1809H12.9158ZM14.607 7.9561C14.5736 7.64385 14.433 7.40072 14.1851 7.22671C13.9396 7.05271 13.6202 6.96571 13.2269 6.96571C12.9504 6.96571 12.7132 7.00742 12.5153 7.09085C12.3175 7.17427 12.1661 7.28749 12.0613 7.43051C11.9564 7.57353 11.9028 7.73681 11.9004 7.92035C11.9004 8.0729 11.9349 8.20519 12.0041 8.31722C12.0756 8.42925 12.1721 8.5246 12.2937 8.60326C12.4152 8.67953 12.5499 8.74389 12.6977 8.79633C12.8455 8.84877 12.9945 8.89287 13.1446 8.92862L13.8311 9.10024C14.1076 9.1646 14.3734 9.2516 14.6284 9.36125C14.8859 9.47089 15.1159 9.60914 15.3185 9.776C15.5235 9.94285 15.6856 10.1443 15.8047 10.3802C15.9239 10.6162 15.9835 10.8927 15.9835 11.2097C15.9835 11.6388 15.8739 12.0166 15.6546 12.3432C15.4353 12.6673 15.1183 12.9212 14.7035 13.1047C14.2911 13.2859 13.7918 13.3765 13.2054 13.3765C12.6357 13.3765 12.1411 13.2883 11.7216 13.1119C11.3045 12.9355 10.9779 12.6781 10.7419 12.3396C10.5083 12.0011 10.382 11.5887 10.3629 11.1025H11.668C11.687 11.3575 11.7657 11.5697 11.9039 11.7389C12.0422 11.9082 12.2222 12.0345 12.4438 12.1179C12.6679 12.2013 12.9182 12.2431 13.1947 12.2431C13.4831 12.2431 13.7358 12.2001 13.9527 12.1143C14.172 12.0261 14.3436 11.9046 14.4675 11.7496C14.5915 11.5923 14.6546 11.4088 14.657 11.199C14.6546 11.0083 14.5986 10.851 14.489 10.7271C14.3793 10.6007 14.2256 10.4959 14.0278 10.4124C13.8323 10.3266 13.6035 10.2503 13.3413 10.1836L12.5082 9.96907C11.9051 9.81414 11.4284 9.57935 11.078 9.26471C10.73 8.94769 10.556 8.52698 10.556 8.00258C10.556 7.57115 10.6728 7.19334 10.9064 6.86917C11.1424 6.545 11.463 6.29352 11.8682 6.11475C12.2734 5.9336 12.7323 5.84302 13.2447 5.84302C13.7644 5.84302 14.2196 5.9336 14.6105 6.11475C15.0038 6.29352 15.3125 6.54261 15.5366 6.86202C15.7606 7.17904 15.8763 7.54373 15.8834 7.9561H14.607Z'
                  fill={customAmount ? "#28A745" : "white"}
                />
                <path d='...' fill={customAmount ? "#28A745" : "white"} />
              </svg>
            </span>
          </div>

          <div className='emoji'>
            {/* <BsEmojiSmile color='#fff' /> */}
            <EmojiPicker setEmoji={(emoji) => handleEmoji(emoji)} />
          </div>

          {isConnected ? (
            <div className='send_btn' onClick={() => handleSend()}>
              <svg
                width='16'
                height='15'
                viewBox='0 0 16 15'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
                className='send-icon'
              >
                <path
                  d='M14.3419 7.64462L0.95119 14.092L3.43095 7.64462L0.95119 1.19725L14.3419 7.64462Z'
                  stroke='white'
                  strokeWidth='1.40276'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
            </div>
          ) : (
            <ConnectButton />
          )}
        </div>
      </div>
    </div>
  );
}
