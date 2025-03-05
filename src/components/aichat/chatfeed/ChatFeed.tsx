import { useEffect, useState } from "react";
import "./chatfeed.scss";
import VirtualizedContainer from "../../common/virtualList.tsx";

import dropdownIcon from "../../../assets/dropdownIcon.svg";
import noChatFound from "../../../assets/noChatFound.svg";
import socket from "../../../services/socket.ts";
import UserMessage, { shortenAddress } from "../userMessage/index.tsx";
import {
  getMessages,
  getSuperChatsWithInstanceId,
} from "../../../services/api.ts";
import SuperChatMessage from "../superChat/index.tsx";
import { useAccount } from "wagmi";
import NotificationMessage from "../../common/notificationMessage.tsx";

interface IProps {
  chatInstanceData: any;
  adminAddress: string;
  mutedUsers: string[];
  isModerator: boolean;
}
export default function ChatFeed({
  chatInstanceData,
  adminAddress,
  mutedUsers,
  isModerator,
}: IProps) {
  const { isConnected, address } = useAccount();
  const [page, setPage] = useState<number>(1);
  const [chat, setChat] = useState<any[]>([]);
  const [superChat, setSuperChat] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const limit = 50;
  const [isInitialLoad, setIsInitialLoad] = useState(false);
  const [firstItemIndex, setFirstItemIndex] = useState(0);
  const loadingArray = Array(10).fill(() => 0);
  const symbol = JSON.parse(localStorage?.getItem("tokenData") || "")?.symbol;

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
      const data = await getMessages(page, limit, chatInstanceData?.id);
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

  const getSuperChats = async () => {
    try {
      const data = await getSuperChatsWithInstanceId(chatInstanceData?.id);
      setSuperChat(data);
    } catch (error) {
      console.log("Get SuperChat Error", error);
    }
  };

  useEffect(() => {
    fetchData(1, limit);
    getSuperChats();
  }, []);
  useEffect(() => {
    if (page > 1 && chat?.length >= limit) {
      fetchData(page, limit);
    }
  }, [page]);

  // const { data: chatData, isLoading } = useQuery(["chatMessages", chatInstanceData?.id, page], () => getMessages(page, limit, chatInstanceData?.id), {
  //   keepPreviousData: true,
  //   onSuccess: (data) => {
  //     if (page === 1) setChat(data.reverse());
  //     else setChat((prev) => [...data.reverse(), ...prev]);
  //   },
  // });

  // const { data: superChat = [] } = useQuery(["superChats", chatInstanceData?.id], () => getSuperChatsWithInstanceId(chatInstanceData?.id));

  const handleView = () => {
    if (superChat.length > 0) {
      setIsFullHeight(!isFullHeight);
    }
  };

  const handleDeleteMessage = (messageId: number) => {
    setChat((prevChat) =>
      prevChat.filter((message) => message.id !== messageId)
    );
  };

  // useEffect(() => {
  //   if (!socket) return;
  //   const newMessageHandler = (data: any) => {
  //     console.log("New message received:", data);
  //     if (mutedUsers?.includes(data?.senderAddress as string)) {
  //       throw new Error("You are muted");
  //     }
  //     if (data.amnt) {
  //       setSuperChat((prevChat) => [data, ...prevChat]);
  //     }
  //     setChat((prevChat) => [...prevChat, data]);
  //     setIsInitialLoad(true);
  //   };

  //   // const newSuperChatHandler = (data: any) => {
  //   //   try {
  //   //     setSuperChat(data.messages);
  //   //   } catch (error: any) {
  //   //     NotificationMessage("error", error.message);
  //   //   }
  //   // };

  //   const errorHandler = (err: any) => {
  //     NotificationMessage("error", err.message);
  //   };

  //   socket.on("newMessage", newMessageHandler);
  //   // socket.on("filteredMessages", newSuperChatHandler);
  //   socket.on("error", errorHandler);
  //   return () => {
  //     socket.off("newMessage");
  //     // socket.off("filteredMessages");
  //     socket.off("error");
  //   };
  // }, [socket]);

  useEffect(() => {
    console.log(
      "URL_SS",
      `https://ai-agent-r139.onrender.com/grp-message/sse/${chatInstanceData?.id}`
    );
    const eventSource = new EventSource(
      `https://ai-agent-r139.onrender.com/grp-message/sse/${chatInstanceData?.id}`
    );
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("PUBLIC AI RESPONSE:", data);
      // const assistantMessage = {
      //   role: "assistant",
      //   content: data?.response,
      // };

      // const newMessageRes = {
      //   role: "assistant",
      //   message: data?.response,
      //   id: data?.id,
      //   cSessionId: 1,
      // };
      setChat((prevChat) => [...prevChat, data]);
    };

    eventSource.onerror = (err) => {
      console.error("SSE ERROR:", err);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <div
      className={`feedContainer ${isFullHeight ? "fullHeight" : "splitView"} ${
        isModerator || isAdmin ? "adminfeedContainer" : ""
      }`}
    >
      {/* <div className='feed_controls'></div> */}
      <div className='feed_header'>
        {superChat?.length > 0 && (
          <div className='close_icon' onClick={handleView}>
            <img
              className={`${isFullHeight ? "down" : ""}`}
              src={dropdownIcon}
            />
          </div>
        )}
        <span className='holder'>Super Chat</span>
        {superChat?.length > 0 && (
          <>
            <div className='super_chat_container'>
              {superChat?.slice(0, 3).map((item) => (
                <div className='s_chat_bx' key={item?.id}>
                  <img
                    src={`https://effigy.im/a/${item?.senderAddress}.svg`}
                    alt={`'s icon`}
                    className='icon'
                  />
                  <div className='chat_content'>
                    <div className='name'>
                      {shortenAddress(item?.senderAddress, 4)}
                    </div>
                    <div className='value'>
                      {item?.amnt} &nbsp;{symbol}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {!isFullHeight && (
              <div className='super_listContainer'>
                {!isLoading && superChat?.length === 0 ? (
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
                  instance={chatInstanceData?.id}
                  adminAddress={adminAddress}
                  isAdmin={isAdmin}
                  isModerator={isModerator}
                  mutedUsers={mutedUsers}
                  onDeleteMessage={handleDeleteMessage}
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
