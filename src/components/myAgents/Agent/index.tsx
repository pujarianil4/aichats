import Agent from "./Agent.tsx";
import "./index.scss";
import Emulator from "./Emulator.tsx";
import { getMyAgentData } from "../../../services/agent.ts";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import PageLoader from "../../common/PageLoader.tsx";
export default function AgentHome() {
  const { agentId } = useParams();
  const agent = useQuery({
    queryKey: ["privateagent", agentId],
    queryFn: () => getMyAgentData(agentId!),
    enabled: !!agentId,
  });
  return (
    <>
      {agent.isLoading ? (
        <PageLoader />
      ) : (
        <div className='agenthome'>
          <Agent agent={agent} />
          <Emulator />
        </div>
      )}
    </>
  );
}
