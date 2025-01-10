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
  const limit = 20;
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [firstItemIndex, setFirstItemIndex] = useState(0);
  const loadingArray = Array(10).fill(() => 0);

  const [isFullHeight, setIsFullHeight] = useState(true);
  const fetchData = async (page: number, limit: number) => {
    setIsLoading(true);
    try {
      const data = await getMessages(page, limit);
      if (data.length === 0) return;
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
    if (page > 1) {
      fetchData(page, limit);
    }
  }, [page]);

  useEffect(() => {
    socket.on("chatMessage", (msg) => {
      setChat((prevChat) => [...prevChat, { id: prevChat.length + 1, ...msg }]);
      setIsInitialLoad(true);
    });

    return () => {
      socket.off("chatMessage");
    };

    // socket.on("connect", () => {
    //   console.log("Connected:", socket.id);

    //   // Join the chat with a wallet address
    //   const res = socket.emit(
    //     "join",
    //     "0x99A221a87b3C2238C90650fa9BE0F11e4c499D06"
    //   );
    //   console.log("Sent join event.", res);

    //   // Send a message
    //   // setInterval(() => {
    //   //   console.log("every 2 sec");
    //   //   socket.emit("message", { content: "Hello, World!" });
    //   //   console.log("Sent message event.");
    //   // }, 10000);
    // });

    // // Listen for new messages
    // socket.on("newMessage", (data) => {
    //   console.log("DATA", data);
    //   setChat((prevChat) => [
    //     ...prevChat,
    //     { id: prevChat.length + 1, ...data },
    //   ]);
    //   console.log("New message received:", data);
    // });

    // // Listen for errors
    // socket.on("error", (err) => {
    //   console.error("Error:", err);
    // });
  }, []);

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
        <div className='normal_chat_container' style={{ height: "612px" }}>
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
                  <UserMessage
                    key={index}
                    userIcon={"https://via.placeholder.com/40"}
                    userName={"0x0d2A...008631"}
                    message={
                      chat.message ||
                      chat.content ||
                      `${chat.id}: ${chat.title}`
                    }
                  />
                )}
                footerHeight={10}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
