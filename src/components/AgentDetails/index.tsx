import React, { useEffect } from "react";
import "./index.scss";
import TokenInfo from "./tokeninfo/tokeninfo.tsx";
import SidePanel from "./sidePanel/SidePanel.tsx";

import { useParams } from "react-router-dom";
import { getAgentByID } from "../../services/agent.ts";
import { useQuery } from "@tanstack/react-query";
import PageLoader from "../common/PageLoader.tsx";

export const AgentDetails = () => {
  // const [tokenDetails, setTokenDetails] = React.useState<any>(null);
  const { agentId } = useParams();
  const {
    data: tokenDetails,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["agent", agentId],
    queryFn: () => getAgentByID(agentId!), // Use '!' because agentId is string | undefined
    enabled: !!agentId, // Only run query if agentId exists
  });

  // const getAgentDetails = async (agentID: string) => {
  //   const data = await getAgentByID(agentID);

  //   setTokenDetails(data);
  //   console.log("Data", data);
  // };

  // useEffect(() => {
  //   console.log("params", agentId);

  //   agentId && getAgentDetails(agentId);
  // }, [agentId]);
  return (
    <div className='tokendetails_container'>
      {isLoading && <PageLoader />}
      {isError && <p>Error fetching agent details.</p>}
      {tokenDetails && (
        <>
          {" "}
          <TokenInfo tokenDetails={tokenDetails} />
          <SidePanel tokenDetails={tokenDetails} />{" "}
        </>
      )}
    </div>
  );
};
