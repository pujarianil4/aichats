import { AgentDetails } from "../../components/AgentDetails/index.tsx";
import AiChats from "../../components/aichat/index.tsx";
import { useNavigate } from "react-router-dom";

export default function AgentPage() {
  const navigate = useNavigate();
  const handleSetChat = () => {
    navigate("/agent/create-chat-instance");
  };
  return (
    <main>
      {/* <button onClick={handleSetChat}>Set Live Chat</button> */}
      {/* <AgentDetails /> */}
      {/*  */}
      <AiChats />
    </main>
  );
}
