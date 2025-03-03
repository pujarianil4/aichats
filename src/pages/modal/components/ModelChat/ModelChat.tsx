import { useLayoutEffect, useRef } from "react";
import styles from "./ModelChat.module.css";
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
      className={`no_scrollbar ${styles.shadow}`}
      visibility='top'
      size={100}
      ref={scrollRef}
      onWheel={(e) => e.stopPropagation()}
    >
      <div className={styles.chatContainer}>
        <div className={styles.chat}>
          {messages &&
            messages?.map((message: any, index: number) => (
              <div className={styles.chatMessageContainer} key={index}>
                <div className={styles.chatMessageAvatar}>
                  <img src='./images/user.png' width={20} height={20}></img>
                </div>
                <div className={styles.chatMessage}>
                  <p className={styles.role}>
                    {message.role === "assistant"
                      ? selectedCharacter?.name
                      : message?.role}
                  </p>
                  <div className={styles.chatMessageText}>
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
