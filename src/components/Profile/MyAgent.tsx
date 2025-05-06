import { useEffect, useState } from "react";
import { getAllAgentByUser } from "../../services/api.ts";
import NotificationMessage from "../common/notificationMessage.tsx";
import { AgentData } from "../../utils/types.ts";
import "./MyAgents.scss";
import { useNavigate } from "react-router-dom";
import NoData from "../common/noData.tsx";
import PageLoader from "../common/PageLoader.tsx";
export default function MyAgentsComponent() {
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
        <section className='agent_card_container'>
          {isLoadingAgent ? (
            <PageLoader />
          ) : true ? (
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

                  <div className='title_head'>
                    <p className='agent_head'>
                      <strong>{agent?.name}</strong> &nbsp; $Lamaa&nbsp;
                      <span>(4days ago)</span>
                    </p>
                    <p className={`${true ? "active" : "deactive"}`}>Active</p>
                  </div>

                  <p className='agent_description'>{agent?.desc}</p>
                  {/* <div className='tabs'>
                    <p>tag 1</p>
                    <p>tag 2</p>
                    <p>tag 3</p>
                  </div> */}
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
