import ChatFeed from "./chatfeed/ChatFeed.js";
import ChatInput from "./chatInput/ChatInput.js";
import "./index.scss";
import YoutubeVideo from "./youtubeVideo/index.tsx";

interface IProps {
  youtubeLink: string;
  address: string;
}
export default function AiChats({ youtubeLink, address }: IProps) {
  return (
    <div className='aichats'>
      <div className='live'>
        {/* <YoutubeVideo youtubeLink={youtubeLink} /> */}
      </div>
      <div className='chatfeed'>
        <ChatFeed />
        <ChatInput />
      </div>
    </div>
  );
}
