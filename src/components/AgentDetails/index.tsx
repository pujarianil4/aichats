import React, { useEffect } from "react";
import "./index.scss";
import TokenInfo from "./tokeninfo/tokeninfo.tsx";
import SidePanel from "./sidePanel/SidePanel.tsx";

import { useParams } from "react-router-dom";
import { getAgentByID } from "../../services/agent.ts";

export const AgentDetails = () => {
  const [tokenDetails, setTokenDetails] = React.useState<any>(null);
  const { agentId } = useParams();

  const getAgentDetails = async (agentID: string) => {
    const data = await getAgentByID(agentID);

    setTokenDetails(data);
    console.log("Data", data);
  };

  useEffect(() => {
    console.log("params", agentId);

    agentId && getAgentDetails(agentId);
  }, [agentId]);
  return (
    <div className='tokendetails_container'>
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
