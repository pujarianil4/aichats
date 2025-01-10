import { useEffect, useRef, useState } from "react";
import "./chatfeed.scss";
import VirtualizedContainer from "../../common/virtualList.tsx";

import closeIcon from "../../../assets/close.svg";
import socket from "../../../services/socket.ts";
import UserMessage from "../userMessage/index.tsx";
export default function ChatFeed() {
  const [page, setPage] = useState(1);
  const [chat, setChat] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const limit = 10;
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [isAutoScrollEnabled, setIsAutoScrollEnabled] = useState(true);
  const loadingArray = Array(5).fill(() => 0);

  const [isFullHeight, setIsFullHeight] = useState(true);

  useEffect(() => {
    // if wallet add succesfull then start connect
    // Listen for incoming messages
    socket.on("chatMessage", (msg) => {
      setChat((prevChat) => [...prevChat, { id: prevChat.length + 1, ...msg }]);
    });

    return () => {
      socket.off("chatMessage"); // Cleanup
    };
  }, []);

  // Auto-scroll when new messages arrive if auto-scroll is enabled
  useEffect(() => {
    if (isAutoScrollEnabled && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chat, isAutoScrollEnabled]);

  return (
    <div
      className={`feedContainer ${isFullHeight ? "fullHeight" : "splitView"}`}
    >
      <div className='feed_header'>
        <div
          className='close_icon'
          onClick={() => setIsFullHeight(!isFullHeight)}
        >
          <img src={closeIcon} />
        </div>
        <span className='holder'> Holders Chat</span>
        <div className='super_chat_container'>
          <div className='s_chat_bx'>
            <img
              src='https://via.placeholder.com/40'
              alt={`'s icon`}
              className='icon'
            />
            <div className='chat_content'>
              <span className='name'>0xgh...7897</span>
              <span className='value'> $1000 </span>
            </div>
          </div>
        </div>
        <div>
          {!isFullHeight && (
            <div className='super_listContainer'>
              {!isLoading && chat?.length === 0 ? (
                <p>No data</p>
              ) : (
                <VirtualizedContainer
                  listData={chat}
                  isLoading={isLoading}
                  page={page}
                  setPage={setPage}
                  limit={limit}
                  renderComponent={(index: number, chat: any) => (
                    <UserMessage
                      key={index}
                      userIcon={"https://via.placeholder.com/40"}
                      userName={"0x0d2A...008631"}
                      message={chat.message}
                    />
                  )}
                  footerHeight={10}
                />
              )}
            </div>
          )}
        </div>
      </div>

      <div className='chat_ox'>
        <div className='normal_chat_container'>
          {!isLoading && chat?.length === 0 ? (
            <p>No data</p>
          ) : page < 2 && isLoading ? (
            loadingArray.map((_: any, i: number) => <p key={i}>Loading...</p>)
          ) : (
            <>
              <VirtualizedContainer
                listData={chat}
                isLoading={isLoading}
                page={page}
                setPage={setPage}
                limit={limit}
                renderComponent={(index: number, chat: any) => (
                  <UserMessage
                    key={index}
                    userIcon={"https://via.placeholder.com/40"}
                    userName={"0x0d2A...008631"}
                    message={chat.message}
                  />
                )}
                footerHeight={10}
              />

              {isLoading && page > 1 && <p>Loading...</p>}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
