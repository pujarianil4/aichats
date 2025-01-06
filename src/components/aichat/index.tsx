import React from "react";
import ChatFeed from "./chatfeed/ChatFeed.js";
import ChatInput from "./chatInput/ChatInput.js";
import "./index.scss";
export default function AiChats() {
  return (
    <div className='aichats'>
      <div className='live'>youtube live</div>
      <div className='chatfeed'>
        <ChatFeed />
        <ChatInput />
      </div>
    </div>
  );
}
