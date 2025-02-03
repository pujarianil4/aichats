import { useEffect, useState } from "react";
import { getAllAgentByUser } from "../../services/api.ts";
import NotificationMessage from "../../components/common/notificationMessage.tsx";
import { AgentData } from "../../utils/types.ts";
import "./index.scss";
import { useNavigate } from "react-router-dom";
import NoData from "../../components/common/noData.tsx";

export default function MyAgentsPage() {
  const navigate = useNavigate();
  const [isLoadingAgent, setIsLoadingAgent] = useState(false);
  const [myAgents, setMyAgents] = useState<AgentData[]>([]);

  const fetMyAgent = async () => {
    setIsLoadingAgent(true);
    try {
      const response: AgentData[] = await getAllAgentByUser();
      if (response?.length > 0) setMyAgents(response);
    } catch (error: any) {
      NotificationMessage("error", error?.message);
    } finally {
      setIsLoadingAgent(false);
    }
  };

  console.log("myagents", myAgents);
  useEffect(() => {
    fetMyAgent();
  }, []);

  const handleNavigate = (agentId: string) => {
    navigate(`/myagent/${agentId}`);
  };

  return (
    <main className='my_agent_page_container'>
      <div>
        <h1>My Agents</h1>
        <section className='agent_card_container'>
          {isLoadingAgent ? (
            <div className='agent_cards'>
              {Array(10)
                .fill(0)
                ?.map((_, index: number) => (
                  <div key={index} className='agent_card skeleton'></div>
                ))}
            </div>
          ) : myAgents.length > 0 ? (
            <div className='agent_cards'>
              {myAgents?.map((agent: AgentData) => (
                <div
                  className='agent_card'
                  key={agent?.id}
                  onClick={() => handleNavigate(agent?.id)}
                >
                  <div className='card_head'>
                    <img src={agent?.pic} />
                  </div>
                  {/* TODO: Update status later */}
                  <p className={`${true ? "active" : "deactive"}`}>Active</p>
                  <p className='agent_head'>
                    <strong>{agent?.name}</strong> &nbsp; $Lamaa&nbsp;
                    <span>(4days ago)</span>
                  </p>
                  <p className='agent_description'>{agent?.desc}</p>
                  <div className='tabs'>
                    <p>tag 1</p>
                    <p>tag 2</p>
                    <p>tag 3</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <NoData />
          )}
        </section>
      </div>
    </main>
  );
}
