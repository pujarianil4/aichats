import { useEffect, useState } from "react";
import "./chatfeed.scss";
import VirtualizedContainer from "../../common/virtualList.tsx";

import closeIcon from "../../../assets/close.svg";
import noChatFound from "../../../assets/noChatFound.svg";
import socket from "../../../services/socket.ts";
import UserMessage, { shortenAddress } from "../userMessage/index.tsx";
import { getMessages } from "../../../services/api.ts";
import SuperChatMessage from "../superChat/index.tsx";
import { useAccount } from "wagmi";
export default function ChatFeed() {
  const path = window.location.pathname;
  const param = path.split("/")[1];
  const { isConnected } = useAccount();
  const [page, setPage] = useState<number>(1);
  const [chat, setChat] = useState<any[]>([]);
  const [superChat, setSuperChat] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const limit = 50;
  const [isInitialLoad, setIsInitialLoad] = useState(false);
  const [firstItemIndex, setFirstItemIndex] = useState(0);
  const loadingArray = Array(10).fill(() => 0);

  useEffect(() => {
    if (isConnected) {
      const isAdminUser = JSON.parse(
        sessionStorage.getItem("isAdmin") as string
      );
      setIsAdmin(isAdminUser);
    }
  }, [isConnected]);

  const [isFullHeight, setIsFullHeight] = useState(true);
  const fetchData = async (page: number, limit: number) => {
    setIsLoading(true);
    try {
      const data = await getMessages(page, limit, +param);
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

  const handleView = () => {
    if (superChat.length > 0) {
      setIsFullHeight(!isFullHeight);
    }
  };

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

    //socket.on('filteredMessages', (data) => {
    // console.log('filtered message ', data);

    const newSuperChatHandler = (data: any) => {
      const newData = data.messages;
      console.log("New super chat received:", newData);
      // TODO: update it skey from BE
      // setSuperChat((prevChat) => [
      //   ...prevChat,
      //   { id: prevChat.length + 1, ...newData },
      // ]);

      setSuperChat(newData);
    };

    const errorHandler = (err: any) => {
      console.error("Error:", err);
    };

    socket.on("newMessage", newMessageHandler);
    socket.on("filteredMessages", newSuperChatHandler);
    socket.on("error", errorHandler);
    return () => {
      socket.off("newMessage");
      socket.off("filteredMessages");
      socket.off("error");
    };
  }, []);

  return (
    <div
      className={`feedContainer ${isFullHeight ? "fullHeight" : "splitView"}`}
    >
      <div className='feed_header'>
        {/* TODO: expand only if there is a superChat */}
        <div
          className='close_icon'
          // onClick={() => setIsFullHeight(!isFullHeight)}
          onClick={handleView}
        >
          <img src={closeIcon} />
        </div>
        <span className='holder'>Super Chat</span>
        {superChat.length > 0 && (
          <>
            {/* TODO: LATEST SUPER CHATS */}
            <div className='super_chat_container'>
              {[superChat[0], superChat[1], superChat[2]].map((item) => (
                <div className='s_chat_bx' key={item.id}>
                  <img
                    src={`https://effigy.im/a/${item.senderAddress}.svg`}
                    // src='https://via.placeholder.com/40'
                    alt={`'s icon`}
                    className='icon'
                  />
                  <div className='chat_content'>
                    <div className='name'>
                      {shortenAddress(item.senderAddress, 3)}
                    </div>
                    <div className='value'>{item.amnt}</div>
                  </div>
                </div>
              ))}
              {/* <div className='s_chat_bx'>
                <img
                  src={`https://effigy.im/a/${"0xD5b26AC46d2F43F4d82889f4C7BBc975564859e3"}.svg`}
                  // src='https://via.placeholder.com/40'
                  alt={`'s icon`}
                  className='icon'
                />
                <div className='chat_content'>
                  <div className='name'>
                    {shortenAddress(
                      "0xD5b26AC46d2F43F4d82889f4C7BBc975564859e3",
                      4
                    )}
                  </div>
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
              </div> */}
            </div>

            {!isFullHeight && (
              <div className='super_listContainer'>
                {!isLoading && superChat?.length === 0 ? (
                  // <img src={noChatFound} alt='No chat found' loading='lazy' />
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
                      listData={superChat}
                      isLoading={isLoading}
                      setPage={setPage}
                      limit={limit}
                      firstItemIndex={firstItemIndex}
                      isInitialLoad={isInitialLoad}
                      setIsInitialLoad={setIsInitialLoad}
                      customScrollSelector={"super_listContainer"}
                      renderComponent={(index: number, chat: any) => (
                        <SuperChatMessage key={index} data={chat} />
                      )}
                      footerHeight={50}
                    />
                  </>
                )}
              </div>
            )}
          </>
        )}
      </div>

      <div className='listContainer'>
        {!isLoading && chat?.length === 0 ? (
          <div className='noChatFound'>
            <img src={noChatFound} alt='No chat found' loading='lazy' />
          </div>
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
                  data={chat}
                  instance={+param}
                  isAdmin={isAdmin}
                />
              )}
              footerHeight={24}
            />
          </>
        )}
      </div>
    </div>
  );
}
