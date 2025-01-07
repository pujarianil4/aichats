import { useEffect, useState } from "react";
import "./chatfeed.scss";
import VirtualizedContainer from "../../common/virtualList.tsx";
import socket from "../../../services/socket.ts";
export default function ChatFeed() {
  const [page, setPage] = useState(1);
  const [chat, setChat] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const limit = 10;
  const loadingArray = Array(5).fill(() => 0);
  console.log("PAGE", page);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=${limit}`
      );
      const data = await response.json();
      console.log("DATA", data);
      setChat((prevChat) => [...prevChat, ...data]);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };
  // useEffect(() => {
  //   fetchData();
  // }, [page]);

  useEffect(() => {
    // Listen for incoming messages
    socket.on("chatMessage", (msg) => {
      setChat((prevChat) => [...prevChat, { id: prevChat.length + 1, ...msg }]);
    });

    return () => {
      socket.off("chatMessage"); // Cleanup
    };
  }, []);

  return (
    <div className='feedContainer'>
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
              <div className='items' key={index}>
                {chat.id}: {chat.message}
              </div>
            )}
            footerHeight={150}
          />

          {isLoading && page > 1 && <p>Loading...</p>}
        </>
      )}
    </div>
  );
}
