import React, { useState, useRef, useEffect } from "react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import TipPanel from "./TipPanel.tsx";
import "./chatinput.scss";
import { FaDollarSign } from "react-icons/fa6";
import { BsEmojiSmile } from "react-icons/bs";

export default function ChatInput() {
  const { isConnected } = useAccount();
  const [message, setMessage] = useState("");
  const [showTipPopup, setShowTipPopup] = useState(false);
  const tipPopupRef = useRef<HTMLDivElement>(null);

  const superChatAdminAddress = "0xe80fe9b925F2717047e6f0CcF2A82367bdDf2219";

  const handleSendMessage = () => {
    console.log("Sending message:", message);
    setMessage("");
  };

  // Close the popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        tipPopupRef.current &&
        !tipPopupRef.current.contains(event.target as Node)
      ) {
        setShowTipPopup(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className='chatinputContainer'>
      {showTipPopup && (
        <div className='tip-popup' ref={tipPopupRef}>
          <TipPanel recipient={superChatAdminAddress} />
        </div>
      )}
      <div className='inputs'>
        <input
          type='text'
          className='input_text'
          placeholder='Send a Message'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <div
          className='tip_btn'
          onClick={() => setShowTipPopup((prev) => !prev)}
        >
          <FaDollarSign color='#fff' />
        </div>
        <div className='emoji'>
          <BsEmojiSmile color='#fff' />
        </div>
        {isConnected ? (
          <div className='send_btn' onClick={handleSendMessage}>
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
  );
}
