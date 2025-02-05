import React, { useCallback, useRef, useState } from "react";
import "./emulator.scss";
import VirtualizedContainer from "../../common/virtualList.tsx";
import { IoReloadSharp } from "react-icons/io5";
import { BsThreeDots } from "react-icons/bs";
import { LuPanelRightClose } from "react-icons/lu";
import { Popover } from "antd";

// main agent_container and emulator container shold be scrolable
// Show not chat UI

// Emulator animation for closing and opening
// pop over with 2 options as per SS
/// 1 Start as new user - for start fresh chat, like clear old memory
/// 2 Simulate timeout event - until this AI should waiting for user input
// on reset chat button clear chat
// with up and down arrow previous text are coming in chat input

interface IProps {
  toggleEmulator: () => void;
}

export default function Emulator({ toggleEmulator }: IProps) {
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>(
    []
  );

  const handleReset = useCallback(() => setMessages([]), []);
  const handleStartNewUser = useCallback(
    () =>
      setMessages([{ sender: "bot", text: "Starting new conversation..." }]),
    []
  );
  const handleSimulateTimeout = useCallback(
    () =>
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "AI timeout event simulated." },
      ]),
    []
  );

  const content = (
    <div className='emulator_popover'>
      <div className='popover_item' onClick={handleStartNewUser}>
        Start as new user
      </div>
      <div className='popover_item' onClick={handleSimulateTimeout}>
        Simulate timeout event
      </div>
    </div>
  );

  return (
    <div className='emulator_container'>
      <div className='emulator_head'>
        <LuPanelRightClose
          size={18}
          className='toggle-btn'
          onClick={toggleEmulator}
        />
        <h3 style={{ textAlign: "center" }}>Emulator</h3>
        <div>
          <IoReloadSharp
            size={18}
            onClick={handleReset}
            style={{ cursor: "pointer" }}
          />{" "}
          &nbsp;
          <Popover
            content={content}
            placement='bottomRight'
            trigger='click'
            arrow={false}
          >
            <BsThreeDots size={18} style={{ cursor: "pointer" }} />
          </Popover>
        </div>
      </div>
      <Chat messages={messages} setMessages={setMessages} />
    </div>
  );
}

// Chat Component
function Chat({
  messages,
  setMessages,
}: {
  messages: { sender: string; text: string }[];
  setMessages: React.Dispatch<
    React.SetStateAction<{ sender: string; text: string }[]>
  >;
}) {
  const [page, setPage] = useState(0);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  const handleSend = useCallback(
    async (text: string) => {
      if (!text.trim()) return;

      const userMessage = { sender: "user", text };
      setMessages((prev) => [...prev, userMessage]);

      const response = await getChatGPTResponse(text);
      const botMessage = { sender: "bot", text: response };
      setMessages((prev) => [...prev, botMessage]);

      setTimeout(() => {
        if (messagesContainerRef.current) {
          messagesContainerRef.current.scrollTop =
            messagesContainerRef.current.scrollHeight;
        }
      }, 100);
    },
    [setMessages]
  );

  const getChatGPTResponse = async (query: string) => {
    return new Promise<string>((resolve) => {
      setTimeout(() => {
        resolve("This is a simulated response from ChatGPT.");
      }, 1000);
    });
  };

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
      <InputField onSend={handleSend} />
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
    message: { sender: string; text: string }
  ) => <Message key={index} sender={message.sender} text={message.text} />;

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
function Message({ sender, text }: { sender: string; text: string }) {
  return <div className={`message ${sender}`}>{text}</div>;
}

// InputField
const InputField = React.memo(
  ({ onSend }: { onSend: (text: string) => void }) => {
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
