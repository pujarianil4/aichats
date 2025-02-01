import { useEffect, useState } from "react";
import { getAllAgentByUser } from "../../services/api.ts";
import NotificationMessage from "../../components/common/notificationMessage.tsx";
import { AgentData } from "../../utils/types.ts";
import "./index.scss";
import { useQuery } from "@tanstack/react-query";
import PageLoader from "../../components/common/PageLoader.tsx";

export default function MyAgentsPage() {
  // const [myAgents, setMyAgents] = useState<AgentData[]>([]);
  const {
    data: myAgents,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["myagent"],
    queryFn: () => getAllAgentByUser(),
  });

  return (
    <main className='my_agent_page_container'>
      {isLoading ? (
        <PageLoader />
      ) : (
        <div>
          <h1>My Agents</h1>
          <section className='agent_card_container'>
            {myAgents?.map((agent: AgentData) => (
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
            ))}
          </section>
        </div>
      )}
    </main>
  );
}
