import { useEffect, useState } from "react";
import { getAllAgentByUser } from "../../services/api.ts";
import NotificationMessage from "../../components/common/notificationMessage.tsx";
import { AgentData } from "../../utils/types.ts";
import "./index.scss";
import { useNavigate } from "react-router-dom";

export default function MyAgentsPage() {
  const [myAgents, setMyAgents] = useState<AgentData[]>([]);
  const navigate = useNavigate();
  const fetMyAgent = async () => {
    try {
      const response: AgentData[] = await getAllAgentByUser();
      setMyAgents(response);
    } catch (error: any) {
      NotificationMessage("error", error?.message);
    }
  };

  console.log("myagents", myAgents);
  useEffect(() => {
    fetMyAgent();
  }, []);
  return (
    <main className='my_agent_page_container'>
      <div>
        <h1>My Agents</h1>
        <section className='agent_card_container'>
          {[...myAgents]?.map((agent: AgentData) => (
            <div
              key={agent.id}
              className='agent_card'
              onClick={() => navigate(`/myagent/${agent.id}`)}
            >
              <h3>
                {agent?.name}
                <span className={`${true ? "active" : "deactive"} `}>
                  Active
                </span>
              </h3>
              <p>{agent?.desc}</p>
              <h2>20</h2>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
