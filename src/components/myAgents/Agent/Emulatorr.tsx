import React, { useCallback, useEffect, useRef, useState } from "react";
import "./emulatorr.scss";
import VirtualizedContainer from "../../common/virtualList.tsx";
import { useParams } from "react-router-dom";
import { LuPanelRightClose } from "react-icons/lu";
import {
  chatWithOnetoOneAgent,
  createOnetoOneChatSession,
  deleteOnetoOneChatHistory,
  getOnetoOneChatHistoryBySession,
  getOnetoOneChatSession,
} from "../../../services/agent.ts";
import { EventSource } from "eventsource";
import { useQuery } from "@tanstack/react-query";
import PageLoader from "../../common/PageLoader.tsx";
import { Spin, Skeleton } from "antd";
import { BsTextareaResize } from "react-icons/bs";
import ReactMarkdown from "react-markdown";
import { MdDeleteOutline } from "react-icons/md";
import NoData from "../../common/noData.tsx";
import { useAppDispatch, useAppSelector } from "../../../hooks/reduxHooks.tsx";
import { setClearHistory } from "../../../contexts/reducers/index.ts";
import Cookies from "js-cookie";
import { IoIosArrowDropdown, IoMdArrowBack } from "react-icons/io";
import { decryptToken } from "../../../services/apiconfig.ts";
import { IoSettingsOutline } from "react-icons/io5";

export default function Emulatorr({
  isEmulatorOpen,
  agentInfo,
  toggleEmulator,
}: {
  isEmulatorOpen: boolean;
  agentInfo: any;
  toggleEmulator: () => void;
}) {
  const { agentId } = useParams();
  const [chats, setChats] = useState<any[]>([]);
  const [viewSize, setViewSize] = useState(2);
  const [pId, setpId] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const clearHistory = useAppSelector(
    (state) => state.user.currentAgent.clearHistory
  );

  const { data: sessionData } = useQuery({
    queryKey: ["chatSession", agentId],
    queryFn: async () => {
      const res = await getOnetoOneChatSession(agentId as string);
      if (!res[0]) {
        return createOnetoOneChatSession(agentId as string);
      }
      return res[0];
    },
    staleTime: 1000 * 30 * 1,
    refetchOnWindowFocus: true,
  });

  const {
    data: chatHistory,
    isLoading: chatLoading,
    refetch,
  } = useQuery({
    queryKey: ["chatHistory", sessionData?.id],
    queryFn: () => getOnetoOneChatHistoryBySession(sessionData?.id),
    enabled: !!sessionData?.id,
    // select: (data) => data.reverse(),
    refetchOnWindowFocus: true,
  });
  const dispatch = useAppDispatch();
  useEffect(() => {
    // console.log("agentInfo", chatHistory, agentInfo);
    // setChats(chatHistory || []);
    if (chatHistory?.length > 0) {
      setChats([...chatHistory].reverse());
    }
  }, [chatHistory]);

  useEffect(() => {
    if (clearHistory) {
      setChats([]);
      dispatch(setClearHistory(false));
    }
  }, [clearHistory, refetch]);

  const handleReset = async () => {
    await deleteOnetoOneChatHistory(sessionData?.id);
    setChats([]);
    setpId(null);
  };

  // useEffect(() => {
  //   if (userId) {
  //     socketAgent.emit("registerUser", userId);
  //   }
  //   return () => {
  //     socketAgent.off("registerUser");
  //   };
  // }, [userId]);

  if (chatLoading || !sessionData) {
    return (
      <div className='emulator_container'>
        <PageLoader />
      </div>
    );
  }

  return (
    <>
      {viewSize == 2 && (
        <div className='emulator_container'>
          <div className='emulator_head'>
            <LuPanelRightClose
              size={18}
              className='toggle-btn'
              onClick={toggleEmulator}
            />
            <h3 style={{ textAlign: "center" }}>Emulator</h3>
            <div>
              <MdDeleteOutline size={18} onClick={handleReset} />

              <IoSettingsOutline
                size={18}
                onClick={() => setShowSettings(!showSettings)}
                className={`${showSettings ? "is_active" : ""}`}
              />
            </div>
          </div>
          {showSettings ? (
            <section className='emulator_settings'>
              <div
                style={{ display: "flex", gap: "8px", alignItems: "center" }}
              >
                <IoMdArrowBack onClick={() => setShowSettings(!showSettings)} />
                <h3>Chat Settings</h3>
              </div>
              {/* <div>
                <label></label> <input placeholder='Type Here' />

              </div> */}
              <p>Set Minimum Amount</p>
              <div className='setting_item'>
                {/* <p>Set Minimum Amount</p> */}
                {/* TODO: add regex fo number */}
                <input
                  placeholder='0'
                  // value={minAmount}
                  // onChange={handleChange}
                />
                <button onClick={() => {}}>Update</button>
              </div>
              <p>Set Free Chats</p>
              <div className='setting_item'>
                <input placeholder='0' />
                <button onClick={() => {}}>Update</button>
              </div>
            </section>
          ) : (
            <Chat
              messages={chats}
              setMessages={setChats}
              sessionId={sessionData?.id}
              pId={pId}
              setpId={setpId}
              agentInfo={agentInfo}
            />
          )}
        </div>
      )}
      {viewSize == 1 && (
        <div onClick={() => setViewSize(2)} className='view_1'>
          <p>Emulator</p>
        </div>
      )}
    </>
  );
}

// Chat Component
function Chat({
  messages,
  setMessages,
  sessionId,
  pId,
  setpId,
  agentInfo,
}: {
  messages: any;
  setMessages: any;
  sessionId: string;
  pId: number | null;
  setpId: any;
  agentInfo: any;
}) {
  const [page, setPage] = useState(0);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [showGoToBottom, setShowGoToBottom] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  // const [pId, setpId] = useState(null);
  const getLastElements = (arr: any, count = 40) => arr.slice(-count);
  const latestHistory = getLastElements(messages).map((item: any) => {
    if (item?.role === "assistant") {
      return {
        role: item?.role,
        content: item?.message,
      };
    } else {
      return {
        role: item?.role,
        name: "test",
        content: item?.message || item?.content,
      };
    }
  });

  const initialPayload = {
    history: latestHistory,
    pId: pId,
    cSessionId: sessionId,
  };

  const [chatPayload, setChatPayload] = useState(initialPayload);
  const [isLoading, setIsLoading] = useState(false);

  const scrollToBottom = useCallback(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, []);

  // useEffect(() => {
  //   if (messages.length == 0) {
  //     setpId(null);
  //   }
  // }, [messages]);

  useEffect(() => {
    const encryptedToken = Cookies.get("token");
    const token = encryptedToken ? decryptToken(encryptedToken) : null;
    let eventSource: EventSource | null = null;
    const connectSSE = () => {
      if (eventSource) eventSource.close();

      eventSource = new EventSource(
        `https://ai-agent-r139.onrender.com/chat-message/sse/${sessionId}`,
        {
          fetch: (input, init: any) =>
            fetch(input, {
              ...init,
              headers: {
                ...init.headers,
                Authorization: `Bearer ${token}`,
              },
            }),
        }
      );
      eventSource.onmessage = (event: any) => {
        const data = JSON.parse(event.data);
        console.log("AI RESPONSE:", data);

        const assistantMessage = {
          role: "assistant",
          content: data?.response,
        };

        const newMessageRes = {
          role: "assistant",
          message: data?.response,
          id: data?.id,
          cSessionId: sessionId,
        };

        if (data?.message != "Connected to SSE") {
          setChatPayload((prevPayload: any) => ({
            ...prevPayload,
            history: [...prevPayload.history, assistantMessage],
            pId: data?.id,
            cSessionId: sessionId,
          }));

          setpId(data?.id);
          setMessages((prevMessages: any) => [
            ...prevMessages.slice(0, -1),
            newMessageRes,
          ]);
          setIsLoading(false);
          setTimeout(scrollToBottom, 100);
        }
      };

      eventSource.onerror = (err: any) => {
        console.error("SSE ERROR:", err);
        eventSource?.close();
        setMessages((prevMessages: any) => {
          if (prevMessages.length === 0) return prevMessages;
          const lastMessage = prevMessages[prevMessages.length - 1];
          if (lastMessage?.isLoading) {
            return prevMessages.slice(0, -1);
          }
          return prevMessages;
        });
        setIsLoading(false);
      };
    };

    connectSSE();

    const handleTabFocus = () => {
      if (!document.hidden) connectSSE();
    };

    document.addEventListener("visibilitychange", handleTabFocus);

    return () => {
      eventSource?.close();
      document.removeEventListener("visibilitychange", handleTabFocus);
    };
  }, [sessionId, scrollToBottom, setMessages]);

  useEffect(() => {
    scrollToBottom();
  }, []);

  // useEffect(() => {
  //   if (!socketAgent) return;
  //   socketAgent.on("chatResponse", (data) => {
  //     console.log("AI Response:", data);
  //     const assistantMessage = {
  //       role: "assistant",
  //       content: data?.response,
  //     };

  //     const newMessageRes = {
  //       role: "assistant",
  //       message: data?.response,
  //       id: data?.chatId,
  //       cSessionId: sessionId,
  //     };

  //     setChatPayload((prevPayload: any) => ({
  //       ...prevPayload,
  //       history: [...prevPayload.history, assistantMessage],
  //       pId: data?.chatId,
  //       cSessionId: sessionId,
  //     }));

  //     setpId(data?.chatId);
  //     setMessages((prevMessages: any) => [
  //       ...prevMessages.slice(0, -1),
  //       newMessageRes,
  //     ]);
  //     setIsLoading(false);
  //   });

  //   return () => {
  //     socketAgent.off("chatResponse");
  //   };
  // }, [socketAgent]);
  //   {
  //     "name": "albert newton",
  //     "persona": "You are a phicist, working in relativity",
  //     "history": [
  //         {
  //             "role": "user",
  //             "name": "shubham",
  //             "content": "give law's of motion"
  //         }
  //     ],
  //     "kbId": null,
  //     "action": true,
  //     "model_id": "llama-3.3-70b-versatile",
  //     "search_engine_id": null,
  //     "pId": null,
  //     "cSessionId": "f35fe4f2-92cd-4350-9a56-0286a384d2e8"
  // }

  const handleScroll = useCallback(() => {
    if (!messagesContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } =
      messagesContainerRef.current;
    const isAtBottom = scrollHeight - clientHeight <= scrollTop + 10;
    setShowGoToBottom(!isAtBottom);
  }, [messages]);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;
    handleScroll();
    container.addEventListener("scroll", handleScroll);
    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  const handleSend = useCallback(
    async (text: string) => {
      if (!text.trim()) return;
      setTimeout(scrollToBottom, 100);
      setIsLoading(true);

      const newMessage = {
        role: "user",
        name: "Man",
        content: text,
      };

      const loaderMessage = {
        role: "assistant",
        content: "Loading...",
        isLoading: true,
      };

      setMessages((prevMessages: any) => [
        ...prevMessages,
        newMessage,
        loaderMessage,
      ]);

      setChatPayload((prevPayload: any) => {
        const updatedHistory = [...(prevPayload.history || []), newMessage];

        return {
          ...prevPayload,
          history: updatedHistory,
          pId: pId === null ? 1 : pId + 1,
          cSessionId: sessionId,
        };
      });

      const latestPayload = {
        history: [...chatPayload?.history, newMessage],
        pId,
        cSessionId: sessionId,
        model_id: agentInfo?.model_id,
        search_engine_id: agentInfo.search_engine_id,
        kbId: agentInfo.id,
        action: false,
        name: agentInfo.name,
        persona: agentInfo.persona,
      };

      try {
        const res = await chatWithOnetoOneAgent(latestPayload);
      } catch (error) {
        console.log("Error", error);
        setMessages((prevMessages: any) => prevMessages.slice(0, -1));
      }
    },
    [pId, sessionId, chatPayload, setMessages, agentInfo]
  );

  useEffect(() => {
    if (messages.length > 0) {
      setpId(messages[messages.length - 1]?.id || null);
    }
    setChatPayload(initialPayload);
  }, [messages]);

  return (
    <div className='chat_container'>
      <MessageList
        messages={messages}
        isLoading={false}
        setPage={setPage}
        limit={20}
        firstItemIndex={0}
        isInitialLoad={isInitialLoad}
        setIsInitialLoad={setIsInitialLoad}
        containerRef={messagesContainerRef}
      />
      {showGoToBottom && (
        <div className='go_to_bottom' onClick={scrollToBottom}>
          <IoIosArrowDropdown color='#ff00b7' size={32} />
        </div>
      )}
      <InputField onSend={handleSend} isLoading={isLoading} />
    </div>
  );
}

// MessageList Component
function MessageList({
  messages,
  isLoading,
  setPage,
  limit,
  firstItemIndex,
  isInitialLoad,
  setIsInitialLoad,
  containerRef,
}: {
  messages: { sender: string; text: string }[];
  isLoading: boolean;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  limit: number;
  firstItemIndex: number;
  isInitialLoad: boolean;
  setIsInitialLoad: React.Dispatch<React.SetStateAction<boolean>>;
  containerRef: React.RefObject<HTMLDivElement>;
}) {
  const renderComponent = (
    index: number,
    message: any
    // message: { sender: string; text: string; isLoading?: boolean }
  ) => (
    <Message
      key={index}
      isLoadingAnswer={message.isLoading as boolean}
      sender={message.role}
      text={message?.content || message?.message || message?.response}
    />
  );

  if (messages?.length == 0) {
    return <NoData />;
  }

  return (
    <div className='messages' ref={containerRef}>
      <VirtualizedContainer
        listData={messages}
        isLoading={isLoading}
        setPage={setPage}
        limit={limit}
        firstItemIndex={firstItemIndex}
        isInitialLoad={isInitialLoad}
        setIsInitialLoad={setIsInitialLoad}
        renderComponent={renderComponent}
        customScrollSelector='messages'
        footerHeight={90}
      />
    </div>
  );
}

// Component
function Message({
  sender,
  text,
  isLoadingAnswer = false,
}: {
  sender: string;
  text: string;
  isLoadingAnswer: boolean;
}) {
  return (
    <>
      {!isLoadingAnswer ? (
        <div className={`message ${sender}`}>
          <ReactMarkdown>{text}</ReactMarkdown>
        </div>
      ) : (
        <div style={{}}>
          <p>Loading...</p>
          {/* <Skeleton.Input className='msg_skeleton' active /> */}
        </div>
      )}
    </>
  );
}

// InputField
const InputField = React.memo(
  ({
    onSend,
    isLoading,
  }: {
    onSend: (text: string) => void;
    isLoading: boolean;
  }) => {
    const [input, setInput] = useState("");
    const [history, setHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState<number | null>(null);

    const handleSendClick = useCallback(() => {
      if (input.trim()) {
        onSend(input);
        setHistory((prev) => [...prev, input]);
        setInput("");
        setHistoryIndex(null);
      }
    }, [input, onSend]);

    const handleKeyPress = useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
          handleSendClick();
        } else if (e.key === "ArrowUp") {
          setHistoryIndex((prev) => {
            const newIndex =
              prev === null ? history.length - 1 : Math.max(prev - 1, 0);
            setInput(history[newIndex] || "");
            return newIndex;
          });
        } else if (e.key === "ArrowDown") {
          setHistoryIndex((prev) => {
            const newIndex =
              prev === null
                ? null
                : prev < history.length - 1
                ? prev + 1
                : null;
            setInput(newIndex !== null ? history[newIndex] : "");
            return newIndex;
          });
        }
      },
      [history, handleSendClick]
    );

    return (
      <div className='input_container'>
        <input
          type='text'
          value={input}
          disabled={isLoading}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder='Type a message...'
        />

        {isLoading ? (
          <>
            <Spin size='small'></Spin>
          </>
        ) : (
          <button className='send_btn' onClick={handleSendClick}>
            <svg
              width='14'
              height='14'
              viewBox='0 0 16 15'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
              className='send-icon'
            >
              <path
                d='M14.3419 7.64462L0.95119 14.092L3.43095 7.64462L0.95119 1.19725L14.3419 7.64462Z'
                stroke='white'
                strokeWidth='1.40276'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
          </button>
        )}
      </div>
    );
  }
);
