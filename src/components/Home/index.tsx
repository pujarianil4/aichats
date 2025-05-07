"use client";

import { useState } from "react";
import "./index.scss";
import { getAllAgents } from "../../services/api.ts";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  formatToMillions,
  getColorForValue,
  setFallbackURL,
  toFixedNumber,
} from "../../utils/index.ts";
import { Link } from "react-router-dom";
import CustomTabs from "../common/Tabs/Tabs.tsx";
import type { TabsProps } from "antd";
import NoData from "../common/noData.tsx";

export default function index() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("1");

  const { data: agentsData, isLoading: isAgentsLoading } = useQuery({
    queryKey: ["allagents"],
    queryFn: () => getAllAgents(),
  });

  console.log("get all agents Data", agentsData);

  const filteredAgents =
    agentsData
      ?.filter((agent: any) => {
        if (activeTab === "1") return true;
        if (activeTab === "2") return !agent.token?.address;
        if (activeTab === "3") return !!agent.token?.address;
        return true;
      })
      .filter((agent: any) =>
        agent.name.toLowerCase().includes(searchQuery.toLowerCase())
      ) || [];

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "All Token",
      children: null,
    },
    {
      key: "2",
      label: "With Token",
      children: null,
    },
    {
      key: "3",
      label: "Without Token",
      children: null,
    },
  ];

  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };

  return (
    <div className='home_bx'>
      <h1>EXPLORE CUSTOM SPECIALIZED AI AGENT</h1>
      <p>
        Enter the token's contract address WE WILL design the most suitable
        agent for you
      </p>

      <div className='searchBar'>
        <input
          type='text'
          placeholder='Search Address/Token/Txn'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className='categorySection'>
        <h2>Explore Agents</h2>
        <div className='tabs'>
          <CustomTabs
            items={items}
            onChange={handleTabChange}
            activeKey={activeTab}
          />
        </div>

        <div className='agent_bx'>
          <div className='agentGrid'>
            {isAgentsLoading ? (
              <p>Loading...</p>
            ) : filteredAgents.length > 0 ? (
              filteredAgents.map((data: any) => (
                <Link key={data.id} to={`/agent/${data.id}`} className='aCard'>
                  <div
                    className='icon'
                    style={{ backgroundColor: data.iconBg }}
                  >
                    <img src={data.pic} onError={(e) => setFallbackURL(e)} />
                  </div>
                  <div>
                    <div className='name'>{data.name}</div>
                    <div className='description'>{data.desc}</div>
                    <div className='agent-status'>
                      <span>
                        {data.typ.charAt(0).toUpperCase() + data.typ.slice(1)}
                      </span>
                      <span>Launchpad</span>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <NoData />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
