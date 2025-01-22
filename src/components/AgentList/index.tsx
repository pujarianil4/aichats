import React, { useEffect, useState } from "react";
import "./index.scss";
import { Table } from "antd";
import { getAllAgents } from "../../services/api.ts";
import { useNavigate } from "react-router-dom";
export default function AgentList() {
  const [allAgents, setAllAgents] = useState<Array<any>>([]);
  const navigate = useNavigate();
  const setFallbackURL = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src =
      "https://img.freepik.com/free-photo/3d-rendering-animal-illustration_23-2151888074.jpg";
  };

  const getAgents = async () => {
    const agents: Array<any> = await getAllAgents();

    console.log("agents", agents);
    const dataSource = agents.map((agent, index) => {
      return {
        key: (index + 1).toString(),
        aiagent: (
          <div className='table_aiagent'>
            <img src={agent.pic} alt='logo' onError={setFallbackURL} />
            <div>
              <h2>
                {agent.name} <span>${agent.token.tkr}</span>{" "}
              </h2>
              <div>
                <p>AI Agent</p>
                <p>{agent.typ}</p>
              </div>
            </div>
          </div>
        ),
        price: 32 + index, // Incrementing price for diversity
        onehr: 56 + index, // Incrementing onehr for diversity
        twentyfourhr: 5678 + index * 100, // Incrementing 24hr data
        fdv: 5678 + index * 50, // Incrementing FDV
        marketcap: 45678 + index * 1000, // Incrementing marketcap
        link: `agent/${agent.id}`, //`/item/${index + 1}`,
      };
    });

    setAllAgents(dataSource);
  };

  useEffect(() => {
    getAgents();
  }, []);

  const dataSource = Array.from({ length: 30 }, (_, index) => ({
    key: (index + 1).toString(),
    aiagent: (
      <div className='table_aiagent'>
        <img src='https://img.freepik.com/free-photo/3d-rendering-animal-illustration_23-2151888074.jpg' />
        <div>
          <h2>
            Lamma <span>$lamma</span>{" "}
          </h2>
          <div>
            <p>AI Agent</p>
            <p>Productivity</p>
          </div>
        </div>
      </div>
    ),
    price: 32 + index, // Incrementing price for diversity
    onehr: 56 + index, // Incrementing onehr for diversity
    twentyfourhr: 5678 + index * 100, // Incrementing 24hr data
    fdv: 5678 + index * 50, // Incrementing FDV
    marketcap: 45678 + index * 1000, // Incrementing marketcap
    link: "create-agent", //`/item/${index + 1}`,
  }));

  const columns = [
    {
      title: "AI Agent",
      dataIndex: "aiagent",
      key: "aiagent",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "1hr Change",
      dataIndex: "onehr",
      key: "onehr",
    },
    {
      title: "24hr Change",
      dataIndex: "twentyfourhr",
      key: "twentyfourhr",
    },
    {
      title: "FDV",
      dataIndex: "fdv",
      key: "fdv",
    },
    {
      title: "Market Cap",
      dataIndex: "marketcap",
      key: "marketcap",
    },
  ];

  return (
    <div className='agentlist_container'>
      <Table
        className='antd_table'
        pagination={{ position: ["bottomCenter"], pageSize: 10 }}
        dataSource={allAgents}
        columns={columns}
        bordered={false}
        size='small'
        onRow={(record) => ({
          onClick: () => {
            navigate(record.link);
          },
        })}
      />
    </div>
  );
}
