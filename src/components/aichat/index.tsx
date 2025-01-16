import { useState } from "react";
import ChatFeed from "./chatfeed/ChatFeed.js";
import ChatInput from "./chatInput/ChatInput.js";
import "./index.scss";
import closeIcon from "../../assets/close.svg";
import YoutubeVideo from "./youtubeVideo/index.tsx";

interface IProps {
  youtubeLink: string;
  adminAddress: string;
  tokenAddress: string;
  chatInstanceId: number;
}
export default function AiChats({
  youtubeLink,
  adminAddress,
  tokenAddress,
  chatInstanceId,
}: IProps) {
  const [viewSize, setViewSize] = useState(0);
  const [direction, setDirection] = useState<"up" | "down">("up");
  const apiKey = import.meta.env;
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

  const dynamicStyles =
    viewSize === 0
      ? { width: "892px" }
      : viewSize === 1
      ? { width: "446px" }
      : { width: "200px", height: "300px" };

  return (
    <div style={dynamicStyles} className='aichats'>
      <div className='actions' onClick={handleViewSizeChange}>
        {/* <button className='expand_btn' onClick={handleViewSizeChange}> */}
        <img src={closeIcon} />
        {/* </button> */}
      </div>

      <div
        style={viewSize == 2 ? { width: "100%" } : { width: "446px" }}
        className='live'
      >
        {/* Uncomment the next line if you want to display the YouTube video */}
        <YoutubeVideo youtubeLink={youtubeLink} />
      </div>

      <div className='chatfeed'>
        <ChatFeed chatInstanceId={chatInstanceId} />
        <ChatInput
          adminAddress={adminAddress}
          tokenAddress={tokenAddress}
          chatInstanceId={chatInstanceId}
        />
      </div>
    </div>
  );
}
