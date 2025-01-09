import { useEffect, useRef, useState } from "react";
import "./chatfeed.scss";
import VirtualizedContainer from "../../common/virtualList.tsx";
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

  // const fetchData = async () => {
  //   setIsLoading(true);
  //   try {
  //     const response = await fetch(
  //       `https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=${limit}`
  //     );
  //     const data = await response.json();
  //     console.log("DATA", data);
  //     setChat((prevChat) => [...prevChat, ...data]);
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
  // useEffect(() => {
  //   fetchData();
  // }, [page]);

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

  // Handle manual scroll interactions
  // const handleScroll = () => {
  //   if (!scrollRef.current) return;
  //   const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;

  //   // Disable auto-scroll if the user is not at the bottom
  //   const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10;
  //   setIsAutoScrollEnabled(isAtBottom);
  // };

  return (
    <div
      className='feedContainer'
      // ref={scrollRef}
      // onScroll={handleScroll}
      // style={{ overflowY: "auto", height: "600px" }}
    >
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
      <div
        className='listContainer'
        style={{ height: "580px" }}
        // ref={scrollRef}
        // onScroll={handleScroll}
        // style={{ overflowY: "auto", height: "580px" }}
      >
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
                // <div className='items' key={index}>
                //   {chat.id}: {chat.message}
                // </div>
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
  );
}
