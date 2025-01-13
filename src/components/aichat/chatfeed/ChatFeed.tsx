import { useEffect, useState } from "react";
import "./chatfeed.scss";
import VirtualizedContainer from "../../common/virtualList.tsx";

import closeIcon from "../../../assets/close.svg";
import socket from "../../../services/socket.ts";
import UserMessage from "../userMessage/index.tsx";
import { getMessages } from "../../../services/api.ts";
export default function ChatFeed() {
  const [page, setPage] = useState<number>(1);
  const [chat, setChat] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const limit = 50;
  const [isInitialLoad, setIsInitialLoad] = useState(false);
  const [firstItemIndex, setFirstItemIndex] = useState(0);
  const loadingArray = Array(10).fill(() => 0);

  const [isFullHeight, setIsFullHeight] = useState(false);
  const fetchData = async (page: number, limit: number) => {
    setIsLoading(true);
    try {
      const data = await getMessages(page, limit);
      if (!data || data.length === 0) {
        return;
      }
      if (page === 1) {
        setChat(data.reverse());
        setIsInitialLoad(true);
      } else {
        setChat((prevChat) => [...data.reverse(), ...prevChat]);
        setFirstItemIndex((prev) => prev + data.length);
      }
    } catch (error) {
      console.log("Error", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData(1, limit);
  }, []);
  useEffect(() => {
    if (page > 1 && chat?.length >= limit) {
      fetchData(page, limit);
    }
  }, [page]);

  useEffect(() => {
    // socket.on("chatMessage", (msg) => {
    //   setChat((prevChat) => [...prevChat, { id: prevChat.length + 1, ...msg }]);
    //   setIsInitialLoad(true);
    // });

    // return () => {
    //   socket.off("chatMessage");
    // };

    const newMessageHandler = (data: any) => {
      console.log("New message received:", data);
      setChat((prevChat) => [
        ...prevChat,
        { id: prevChat.length + 1, ...data },
      ]);
      setIsInitialLoad(true);
    };

    const errorHandler = (err: any) => {
      console.error("Error:", err);
    };

    socket.on("newMessage", newMessageHandler);
    socket.on("error", errorHandler);
    return () => {
      socket.off("newMessage");
      socket.off("error");
    };
  }, []);

  return (
    <div
      className={`feedContainer ${!isFullHeight ? "fullHeight" : "splitView"}`}
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
              <div className='name'>0xgh...7897</div>
              <div className='value'> $1000 </div>
            </div>
          </div>
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
      </div>

      <div className='listContainer'>
        {!isLoading && chat?.length === 0 ? (
          <p>No data</p>
        ) : page < 2 && isLoading ? (
          loadingArray.map((_: any, i: number) => (
            <div className='messageLoader skeleton' key={i}></div>
          ))
        ) : (
          <>
            {isLoading && page > 1 && (
              <>
                <div className='messageLoader skeleton'></div>
                <div className='messageLoader skeleton'></div>
              </>
            )}
            <VirtualizedContainer
              listData={chat}
              isLoading={isLoading}
              setPage={setPage}
              limit={limit}
              firstItemIndex={firstItemIndex}
              isInitialLoad={isInitialLoad}
              setIsInitialLoad={setIsInitialLoad}
              renderComponent={(index: number, chat: any) => (
                <UserMessage key={index} data={chat} />
              )}
              footerHeight={10}
            />
          </>
        )}
      </div>
    </div>
  );
}
