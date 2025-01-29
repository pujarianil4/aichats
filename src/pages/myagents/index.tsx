import { useEffect, useState } from "react";
import { getAllAgentByUser } from "../../services/api.ts";
import NotificationMessage from "../../components/common/notificationMessage.tsx";
import { AgentData } from "../../utils/types.ts";
import "./index.scss";

export default function MyAgentsPage() {
  const [myAgents, setMyAgents] = useState<AgentData[]>([]);

  const fetMyAgent = async () => {
    try {
      const response: AgentData[] = await getAllAgentByUser();
      setMyAgents(response);
    } catch (error: any) {
      NotificationMessage("error", error?.message);
    }
  };

  useEffect(() => {
    fetMyAgent();
  }, []);
  return (
    <main className='my_agent_page_container'>
      <div>
        <h1>My Agents</h1>
        <section className='agent_card_container'>
          {[...myAgents, ...myAgents, ...myAgents, ...myAgents]?.map(
            (agent: AgentData) => (
              <div className='agent_card'>
                <h3>
                  {agent?.name}{" "}
                  <span className={`${true ? "active" : "deactive"} `}>
                    Active
                  </span>
                </h3>
                <p>{agent?.desc}</p>
                <h2>20</h2>
              </div>
            )
          )}
        </section>
      </div>
    </main>
  );
}
