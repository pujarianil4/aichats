import { useQuery } from "@tanstack/react-query";
import PrivetChat from "./privetChat/index.tsx";
import PublicAiChats from "./publicChat/index.tsx";
import { getMyAgentData } from "../../services/agent.ts";
import { useParams } from "react-router-dom";

export default function AiChat() {
  const { agentId } = useParams();

  const agent = useQuery({
    queryKey: ["privateagent", agentId],
    queryFn: () => getMyAgentData(agentId!),
    enabled: !!agentId,
  });

  console.log("AGENT", agent?.data);
  return (
    <>
      {agent?.data?.interfaceType === "private" && <PrivetChat agent={agent} />}
      {agent?.data?.interfaceType === "publicWithModal" && <PublicAiChats />}
      {agent?.data?.interfaceType === "publicWithReply" && (
        <PublicAiChats isReply />
      )}
    </>
  );
}
