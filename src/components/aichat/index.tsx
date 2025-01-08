import { useEffect, useState } from "react";
import ChatFeed from "./chatfeed/ChatFeed.js";
import ChatInput from "./chatInput/ChatInput.js";
import "./index.scss";
import YoutubeVideo from "./youtubeVideo/index.tsx";
import { checkIfVideoIsLive, getLiveId } from "../../services/api.ts";

interface IProps {
  youtubeLink: string;
  address: string;
}
export default function AiChats({ youtubeLink, address }: IProps) {
  const [viewSize, setViewSize] = useState(0);
  const [direction, setDirection] = useState<"up" | "down">("up");
  const apiKey = import.meta.env;
  const handleViewSizeChange = () => {
    setViewSize((prev) => {
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
      ? { width: "600px" }
      : viewSize === 1
      ? { width: "300px" }
      : { width: "200px", height: "300px" };

  useEffect(() => {
    console.log("API", apiKey);

    //const isLive = checkIfVideoIsLive("818MflVnP4I");
    const liveId = getLiveId("Virtuals Protocol");
  }, []);

  return (
    <div style={dynamicStyles} className='aichats'>
      <div className='actions'>
        <button className='expand_btn' onClick={handleViewSizeChange}>
          Change
        </button>
      </div>

      <div
        style={viewSize == 2 ? { width: "100%" } : { width: "300px" }}
        className='live'
      >
        {/* Uncomment the next line if you want to display the YouTube video */}
        <YoutubeVideo youtubeLink={youtubeLink} />
      </div>

      <div className='chatfeed'>
        <ChatFeed />
        <ChatInput />
      </div>
    </div>
  );
}
