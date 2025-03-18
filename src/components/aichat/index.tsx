import PrivetChat from "./privetChat/index.tsx";
import PublicAiChats from "./publicChat/index.tsx";

export default function AiChat() {
  return (
    <>
      {/* <PublicAiChats /> */}
      <PrivetChat />
      {/* <PublicAiChats isReply /> */}
    </>
  );
}
