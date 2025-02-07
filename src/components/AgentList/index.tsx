import { useEffect, useState } from "react";
import "./index.scss";
import { Table } from "antd";
import { getAllAgents } from "../../services/api.ts";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  formatToMillions,
  getColorForValue,
  setFallbackURL,
  toFixedNumber,
} from "../../utils/index.ts";

export default function AgentList() {
  const [allAgents, setAllAgents] = useState<Array<any>>([]);
  const navigate = useNavigate();

  const { data: agentsData, isLoading: isAgentsLoading } = useQuery({
    queryKey: ["allagents"],
    queryFn: () => getAllAgents(),
  });

  const extractUniqueTokenAddresses = (agents: any[]) => {
    const addresses = agents.map((agent) => agent.token.tCAddress);
    return [...new Set(addresses)];
  };

  const fetchTokenData = async (addresses: string[]) => {
    const url = `https://api.geckoterminal.com/api/v2/networks/base/tokens/multi/${addresses.join(
      "%2C"
    )}?include=top_pools`;
    const response = await axios.get(url);
    return response.data;
  };

  const { data: apiResponse, isLoading: isTokenDataLoading } = useQuery({
    queryKey: ["tokenData", agentsData],
    queryFn: () => fetchTokenData(extractUniqueTokenAddresses(agentsData)),
    enabled: !!agentsData,
  });

  const getAgents = async (agents: any[], apiResponse: any) => {
    const { data: tokenData, included: poolData } = apiResponse;

    const priceChangeMap = new Map();
    poolData.forEach((pool: any) => {
      const baseTokenAddress =
        pool.relationships.base_token.data.id.split("_")[1];
      const quoteTokenAddress =
        pool.relationships.quote_token.data.id.split("_")[1];
      priceChangeMap.set(
        String(baseTokenAddress).toLowerCase(),
        pool.attributes.price_change_percentage
      );
      priceChangeMap.set(
        String(quoteTokenAddress).toLowerCase(),
        pool.attributes.price_change_percentage
      );
    });

    console.log("priceChangeMap", priceChangeMap);

    const dataSource = agents.map((agent, index) => {
      const tokenInfo = tokenData.find(
        (token: any) =>
          String(token.attributes.address).toLowerCase() ===
          String(agent.token.tCAddress).toLowerCase()
      );
      const priceChange = priceChangeMap.get(
        String(agent.token.tCAddress).toLowerCase()
      );

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
                <p>{agent.typ}</p>
              </div>
            </div>
          </div>
        ),
        price: tokenInfo ? toFixedNumber(tokenInfo.attributes.price_usd) : 0,
        onehr: priceChange ? parseFloat(priceChange.h1) : 0, // 1-hour price change
        twentyfourhr: priceChange ? parseFloat(priceChange.h24) : 0, // 24-hour price change
        fdv: tokenInfo ? toFixedNumber(tokenInfo.attributes.fdv_usd) : 0,
        marketcap: tokenInfo
          ? toFixedNumber(tokenInfo.attributes.market_cap_usd)
          : 0,
        link: `agent/${agent.id}`,
      };
    });

    setAllAgents(dataSource);
  };

  useEffect(() => {
    if (agentsData && apiResponse) {
      getAgents(agentsData, apiResponse);
    }
  }, [agentsData, apiResponse]);

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
      render: (value: number) => `$${value}`,
    },
    {
      title: "1hr Change",
      dataIndex: "onehr",
      key: "onehr",
      render: (value: number) => (
        <span
          style={{
            color: getColorForValue(value),
          }}
        >{`${value.toFixed(2)}%`}</span>
      ),
    },
    {
      title: "24hr Change",
      dataIndex: "twentyfourhr",
      key: "twentyfourhr",
      render: (value: number) => (
        <span
          style={{
            color: getColorForValue(value),
          }}
        >{`${value.toFixed(2)}%`}</span>
      ),
    },
    {
      title: "FDV",
      dataIndex: "fdv",
      key: "fdv",
      render: (value: number) => `$${formatToMillions(value)}`,
    },
    {
      title: "Market Cap",
      dataIndex: "marketcap",
      key: "marketcap",
      render: (value: number) => `$${formatToMillions(value)}`,
    },
  ];

  return (
    <div className='agentlist_container'>
      <Table
        className='antd_table'
        loading={isAgentsLoading || isTokenDataLoading}
        pagination={{ position: ["bottomCenter"], pageSize: 10 }}
        dataSource={allAgents.length > 0 ? allAgents : undefined}
        locale={{
          emptyText:
            isAgentsLoading || isTokenDataLoading ? (
              ""
            ) : (
              <div className='custom-no-data'>
                <img
                  src='https://cdn-icons-png.flaticon.com/512/6134/6134065.png'
                  alt='No Data'
                  width='100'
                />
                <p style={{}}>No AI Agents Available</p>
              </div>
            ),
        }}
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
