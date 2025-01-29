import { useState } from "react";
import "./emulator.scss";
import VirtualizedContainer from "../../common/virtualList.tsx";
import { IoReloadSharp } from "react-icons/io5";
import { BsThreeDots } from "react-icons/bs";
import { LuPanelRightClose } from "react-icons/lu";

// Main Emulator Component
export default function Emulator() {
  return (
    <div className='emulator_container'>
      <div className='emulator_head'>
        <LuPanelRightClose size={18} />
        <h3 style={{ textAlign: "center" }}>Emulator</h3>
        <div>
          <IoReloadSharp size={18} /> &nbsp;
          <BsThreeDots size={18} />
        </div>
      </div>
      <Chat />
    </div>
  );
}

// Chat Component
function Chat() {
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>(
    []
  );
  const [page, setPage] = useState(0);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const userMessage = { sender: "user", text };
    setMessages((prev) => [...prev, userMessage]);

    // Simulating a chatGPT response
    const response = await getChatGPTResponse(text);
    const botMessage = { sender: "bot", text: response };
    setMessages((prev) => [...prev, botMessage]);
  };

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
}: {
  messages: { sender: string; text: string }[];
  isLoading: boolean;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  limit: number;
  firstItemIndex: number;
  isInitialLoad: boolean;
  setIsInitialLoad: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const renderComponent = (
    index: number,
    message: { sender: string; text: string }
  ) => <Message key={index} sender={message.sender} text={message.text} />;

  return (
    <div className='messages'>
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
      />
    </div>
  );
}

// Component
function Message({ sender, text }: { sender: string; text: string }) {
  return <div className={`message ${sender}`}>{text}</div>;
}

// InputField
function InputField({ onSend }: { onSend: (text: string) => void }) {
  const [input, setInput] = useState("");

  const handleSendClick = () => {
    if (input.trim()) {
      onSend(input);
      setInput("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendClick();
    }
  };

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
