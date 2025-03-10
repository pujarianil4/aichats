import React, { useCallback, useEffect, useRef, useState } from "react";
import "./index.scss";
import VirtualizedContainer from "../../common/virtualList.tsx";
import { useParams } from "react-router-dom";
import {
  chatWithOnetoOneAgent,
  createOnetoOneChatSession,
  deleteOnetoOneChatHistory,
  getMyAgentData,
  getOnetoOneChatHistoryBySession,
  getOnetoOneChatSession,
} from "../../../services/agent.ts";
import { useQuery } from "@tanstack/react-query";
import PageLoader from "../../common/PageLoader.tsx";
import { Spin } from "antd";
import { BsTextareaResize } from "react-icons/bs";
import ReactMarkdown from "react-markdown";
import { MdDeleteOutline } from "react-icons/md";
import NoData from "../../common/noData.tsx";
import { EventSourcePolyfill } from "event-source-polyfill";
import Cookies from "js-cookie";
import { decryptToken } from "../../../services/apiconfig.ts";

export default function PrivetChat() {
  const { agentId } = useParams();
  const [chats, setChats] = useState([]);
  console.log("CHATS", chats);
  const [viewSize, setViewSize] = useState(2);
  const [pId, setpId] = useState(null);

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
  });

  const { data: chatHistory, isLoading: chatLoading } = useQuery({
    queryKey: ["chatHistory", sessionData?.id],
    queryFn: () => getOnetoOneChatHistoryBySession(sessionData?.id),
    enabled: !!sessionData?.id,
    select: (data) => data.reverse(),
  });

  useEffect(() => {
    setChats(chatHistory || []);
  }, [chatHistory]);

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
            <h3 style={{ textAlign: "center" }}>Chat with AI</h3>
            <div>
              <MdDeleteOutline
                size={18}
                onClick={handleReset}
                style={{ cursor: "pointer" }}
              />
              <BsTextareaResize
                size={18}
                onClick={() => setViewSize(1)}
                style={{ cursor: "pointer" }}
              />
            </div>
          </div>
          <Chat
            messages={chats}
            setMessages={setChats}
            sessionId={sessionData?.id}
            pId={pId}
            setpId={setpId}
          />
        </div>
      )}
      {viewSize == 1 && (
        <div onClick={() => setViewSize(2)} className='view_1'>
          <p>Chat with AI</p>
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
}: {
  messages: any;
  setMessages: any;
  sessionId: string;
  pId: number | null;
  setpId: any;
}) {
  const [page, setPage] = useState(0);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
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
  const { agentId } = useParams();
  const agent = useQuery({
    queryKey: ["privateagent", agentId],
    queryFn: () => getMyAgentData(agentId!),
    enabled: !!agentId,
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

  // TODO: re run on tabSwitch
  useEffect(() => {
    // const eventSource = new EventSource(
    //   `https://ai-agent-r139.onrender.com/chat-message/sse/${sessionId}`
    // );
    const encryptedToken = Cookies.get("token");
    const token = encryptedToken ? decryptToken(encryptedToken) : null;
    console.log("TOKEN", token);
    const eventSource = new EventSourcePolyfill(
      `https://ai-agent-r139.onrender.com/chat-message/sse/${sessionId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
    };

    eventSource.onerror = (err: any) => {
      console.error("SSE ERROR:", err);
      eventSource.close();
      // setMessages((prevMessages: any) => [...prevMessages.slice(0, -1)]);
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

    // if (messages[messages.length - 1]?.isLoading) {
    //   setMessages((prevMessages: any) => [...prevMessages.slice(0, -1)]);
    // }

    return () => {
      eventSource.close();
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
        // model_id: "llama-3.3-70b-versatile",
        model_id: agent?.data?.model_id,
        search_engine_id: agent?.data?.search_engine_id,
        kbId: agent?.data?.id,
        action: false,
        name: agent?.data?.name,
        persona: agent?.data?.persona,
      };

      console.log("CHAT_PAYLOAD", latestPayload);

      try {
        const res = await chatWithOnetoOneAgent(latestPayload);
      } catch (error) {
        console.log("Error", error);
        setMessages((prevMessages: any) => prevMessages.slice(0, -1));
      }
    },
    [pId, sessionId, chatPayload, setMessages, agent]
  );

  useEffect(() => {
    if (messages.length > 0) {
      setpId(messages[messages.length - 1]?.id || null);
    }
    setChatPayload(initialPayload);
    // if (messagesContainerRef.current) {
    //   messagesContainerRef.current.scrollTop =
    //     messagesContainerRef.current.scrollHeight;
    // }
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
      <div className={`message ${sender}`}>
        {!isLoadingAnswer ? (
          <ReactMarkdown>{text}</ReactMarkdown>
        ) : (
          <Spin style={{ marginLeft: "45%", marginTop: "8px" }} size='large' />
        )}
      </div>
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
