import { useLayoutEffect, useRef } from "react";
// import styles from "./ModelChat.module.css";
import "./index.scss";
import { ScrollShadow } from "@nextui-org/react";

const ModelChat = ({ messages, selectedCharacter }: any) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (scrollRef.current) {
      requestAnimationFrame(() => {
        scrollRef.current!.scrollTop = scrollRef.current!.scrollHeight;
      });
    }
  }, [scrollRef.current, messages]);

  return (
    <ScrollShadow
      className={`no_scrollbar shadow`}
      visibility='top'
      size={100}
      ref={scrollRef}
      onWheel={(e) => e.stopPropagation()}
    >
      <div className={`chatContainer`}>
        <div className={`chat`}>
          {messages &&
            messages?.map((message: any, index: number) => (
              <div className={`chatMessageContainer`} key={index}>
                <div className={`chatMessageAvatar`}>
                  <img src='./images/user.png' width={20} height={20}></img>
                </div>
                <div className={`chatMessage`}>
                  <p className={`role`}>
                    {message.role === "assistant"
                      ? selectedCharacter?.name
                      : message?.role}
                  </p>
                  <div className={`chatMessageText`}>
                    {message?.content?.trim()}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </ScrollShadow>
  );
};

export default ModelChat;
