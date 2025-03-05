import AIChat from "./aiChat/index.tsx";
import PublicAiChats from "./publicChat/index.tsx";

export default function AiChat() {
  return (
    <>
      <PublicAiChats />
      {/* <AIChat /> */}
      {/* <PublicAiChats isReply /> */}
    </>
  );
}
