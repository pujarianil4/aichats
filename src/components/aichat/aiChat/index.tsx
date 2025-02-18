import React, { useCallback, useEffect, useRef, useState } from "react";
import "./index.scss";
import VirtualizedContainer from "../../common/virtualList.tsx";
import { IoReloadSharp } from "react-icons/io5";
import { useParams } from "react-router-dom";
import {
  chatWithOnetoOneAgent,
  createOnetoOneChatSession,
  getOnetoOneChatHistoryBySession,
  getOnetoOneChatSession,
} from "../../../services/agent.ts";
import { useQuery, useQueryClient } from "@tanstack/react-query";

// TODO: loader, typescript, autoscroll

export default function AIChat() {
  const { agentId } = useParams();
  const queryClient = useQueryClient();
  const [chats, setChats] = useState([]);

  const { data: sessionData, isLoading: sessionLoading } = useQuery({
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

  const handleReset = useCallback(() => setChats([]), []);

  return (
    <div className='emulator_container'>
      <div className='emulator_head'>
        <h3 style={{ textAlign: "center" }}>Chat with AI</h3>
        <div>
          <IoReloadSharp
            size={18}
            onClick={handleReset}
            style={{ cursor: "pointer" }}
          />
        </div>
      </div>
      <Chat
        messages={chats}
        setMessages={setChats}
        sessionId={sessionData?.id}
      />
    </div>
  );
}

// Chat Component
function Chat({
  messages,
  setMessages,
  sessionId,
}: {
  messages: any;
  setMessages: any;
  sessionId: string;
}) {
  const [page, setPage] = useState(0);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const [pId, setpId] = useState(null);
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

  const handleSend = useCallback(
    async (text: string) => {
      if (!text.trim()) return;

      setIsLoading(true);

      const newMessage = {
        role: "user",
        name: "Man",
        content: text,
      };

      setMessages((prevMessages: any) => [...prevMessages, newMessage]);

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
      };

      try {
        const res = await chatWithOnetoOneAgent(latestPayload);
        const assistantMessage = {
          role: "assistant",
          content: res?.response,
        };

        const newMessageRes = {
          role: "assistant",
          message: res?.response,
          id: res?.chatId,
          cSessionId: sessionId,
        };

        setChatPayload((prevPayload: any) => ({
          ...prevPayload,
          history: [...prevPayload.history, assistantMessage],
          pId: res?.chatId,
          cSessionId: sessionId,
        }));

        setpId(res?.chatId);

        setMessages((prevMessages: any) => [...prevMessages, newMessageRes]);
      } catch (error) {
        console.log("Error", error);
      } finally {
        setIsLoading(false);
      }
    },
    [pId, sessionId, chatPayload, setMessages]
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
        isLoadingAnswer={isLoading}
        setPage={setPage}
        limit={20}
        firstItemIndex={0}
        isInitialLoad={isInitialLoad}
        setIsInitialLoad={setIsInitialLoad}
        containerRef={messagesContainerRef}
      />
      <InputField onSend={handleSend} />
    </div>
  );
}

// MessageList Component
function MessageList({
  messages,
  isLoading,
  isLoadingAnswer,
  setPage,
  limit,
  firstItemIndex,
  isInitialLoad,
  setIsInitialLoad,
  containerRef,
}: {
  messages: { sender: string; text: string }[];
  isLoading: boolean;
  isLoadingAnswer?: boolean;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  limit: number;
  firstItemIndex: number;
  isInitialLoad: boolean;
  setIsInitialLoad: React.Dispatch<React.SetStateAction<boolean>>;
  containerRef: React.RefObject<HTMLDivElement>;
}) {
  const renderComponent = (
    index: number,
    message: { sender: string; text: string }
  ) => (
    <Message
      key={index}
      isLoadingAnswer={isLoadingAnswer as boolean}
      sender={message.role}
      text={message?.content || message?.message || message?.response}
    />
  );

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
  isLoadingAnswer,
}: {
  sender: string;
  text: string;
  isLoadingAnswer: boolean;
}) {
  return (
    <>
      {isLoadingAnswer ? (
        <div className={`message`}>Loading...</div>
      ) : (
        <div className={`message ${sender}`}>{text}</div>
      )}
    </>
  );
}

// InputField
const InputField = React.memo(
  ({
    onSend,
  }: // isLoading,
  {
    onSend: (text: string) => void;
    // isLoading: boolean;
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
      </div>
    );
  }
);
