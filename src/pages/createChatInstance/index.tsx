import { useEffect } from "react";
import ChatInstanceForm from "../../components/chatInstanceForm/index.tsx";
import axios from "axios";

export default function CreateChatInstancePage() {
  // const body = {
  //   instanceId: 1,
  //   senderAddress: "0x79821a0F47e0c9598413b12FE4882b33326B0cF8",
  //   content: "are you working?",
  // };
  // const sendMessage = async () => {
  //   const res = axios.post(
  //     "https://ai-agent-r139.onrender.com/grp-message/message",
  //     body
  //   );
  //   console.log("MESSAGE_RES", res);
  // };

  // useEffect(() => {
  //   sendMessage();
  // }, []);

  // useEffect(() => {
  //   const eventSource = new EventSource(
  //     `https://ai-agent-r139.onrender.com/grp-message/sse/1`
  //   );
  //   eventSource.onmessage = (event) => {
  //     const data = JSON.parse(event.data);
  //     console.log("AI RESPONSE:", data);
  //     const assistantMessage = {
  //       role: "assistant",
  //       content: data?.response,
  //     };

  //     const newMessageRes = {
  //       role: "assistant",
  //       message: data?.response,
  //       id: data?.id,
  //       cSessionId: 1,
  //     };
  //   };

  //   eventSource.onerror = (err) => {
  //     console.error("SSE ERROR:", err);
  //     eventSource.close();
  //   };

  //   return () => {
  //     eventSource.close();
  //   };
  // }, []);
  return (
    <>
      <ChatInstanceForm />
    </>
  );
}
