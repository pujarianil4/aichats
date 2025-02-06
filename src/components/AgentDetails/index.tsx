import React, { useEffect, useState } from "react";
import "./index.scss";
import TokenInfo from "./tokeninfo/tokeninfo.tsx";
import SidePanel from "./sidePanel/SidePanel.tsx";

import { useParams } from "react-router-dom";
import { getAgentByID } from "../../services/agent.ts";
import { useQuery } from "@tanstack/react-query";
import PageLoader from "../common/PageLoader.tsx";

export const AgentDetails = () => {
  const [activeTab, setActiveTab] = useState<string>("");
  const [isMobile, setIsMobile] = useState(false);

  // Function to check screen width
  const checkScreenSize = () => {
    const mobile = window.innerWidth < 992;
    setIsMobile(mobile);
    setActiveTab(mobile ? "info" : "");
  };

  // Update on window resize
  useEffect(() => {
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const { agentId } = useParams();
  const {
    data: tokenDetails,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["agent", agentId],
    queryFn: () => getAgentByID(agentId!),
    enabled: !!agentId,
  });

  return (
    <div className='tokendetails_container'>
      {isLoading && <PageLoader />}
      {isError && <p>Error fetching agent details.</p>}
      {tokenDetails && (
        <>
          <TokenInfo
            tokenDetails={tokenDetails}
            activeTab={isMobile ? activeTab : ""}
          />
          <SidePanel
            tokenDetails={tokenDetails}
            activeTab={isMobile ? activeTab : ""}
          />

          {isMobile && (
            <div className='mobile-buttons'>
              <button
                className={`btn ${activeTab === "info" ? "active" : ""}`}
                onClick={() => setActiveTab("info")}
              >
                Details
              </button>
              <button
                className={`btn ${activeTab === "swap" ? "active" : ""}`}
                onClick={() => setActiveTab("swap")}
              >
                Swap
              </button>
              <button
                className={`btn ${activeTab === "feed" ? "active" : ""}`}
                onClick={() => setActiveTab("feed")}
              >
                Feed
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
