import { useEffect, useState } from "react";
import "./chatfeed.scss";
import VirtualizedContainer from "../../common/virtualList.tsx";
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
    // socket.on("chatMessage", (msg) => {
    //   setChat((prevChat) => [...prevChat, { id: prevChat.length + 1, ...msg }]);
    //   setIsInitialLoad(true);
    // });

    // return () => {
    //   socket.off("chatMessage");
    // };

    socket.on("connect", () => {
      console.log("Connected:", socket.id);

      // Join the chat with a wallet address
      const res = socket.emit(
        "join",
        "0x99A221a87b3C2238C90650fa9BE0F11e4c499D06"
      );
      console.log("Sent join event.", res);

      // Send a message
      // setInterval(() => {
      //   console.log("every 2 sec");
      //   socket.emit("message", { content: "Hello, World!" });
      //   console.log("Sent message event.");
      // }, 10000);
    });

    // Listen for new messages
    socket.on("newMessage", (data) => {
      console.log("DATA", data);
      setChat((prevChat) => [
        ...prevChat,
        { id: prevChat.length + 1, ...data },
      ]);
      console.log("New message received:", data);
    });

    // Listen for errors
    socket.on("error", (err) => {
      console.error("Error:", err);
    });
  }, []);

  return (
    <div className='feedContainer'>
      <div className='feed_header'>
        <div className='close_icon'>
          <svg
            width='28'
            height='25'
            viewBox='0 0 22 19'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              d='M7.84357 3.94482V5.75057C7.84357 6.06984 7.69538 6.37604 7.43159 6.6018C7.16781 6.82756 6.81004 6.95439 6.437 6.95439H4.32715M16.9863 6.95439H14.8764C14.5034 6.95439 14.1456 6.82756 13.8818 6.6018C13.618 6.37604 13.4698 6.06984 13.4698 5.75057V3.94482M13.4698 14.7793V12.9735C13.4698 12.6543 13.618 12.3481 13.8818 12.1223C14.1456 11.8965 14.5034 11.7697 14.8764 11.7697H16.9863M4.32715 11.7697H6.437C6.81004 11.7697 7.16781 11.8965 7.43159 12.1223C7.69538 12.3481 7.84357 12.6543 7.84357 12.9735V14.7793'
              stroke='white'
              stroke-width='1.81116'
              stroke-linecap='round'
              stroke-linejoin='round'
            />
          </svg>
        </div>
      </div>
      <div className='listContainer' style={{ height: "580px" }}>
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
                    chat.message || chat.content || `${chat.id}: ${chat.title}`
                  }
                />
              )}
              footerHeight={10}
            />
          </>
        )}
      </div>
    </div>
  );
}
