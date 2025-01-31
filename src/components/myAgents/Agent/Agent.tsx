import React, { useState, useEffect } from "react";
import "./agent.scss";
import { FaXTwitter } from "react-icons/fa6";
import { Collapse, Select } from "antd";
import type { CollapseProps } from "antd";
import NotificationMessage from "../../common/notificationMessage.tsx";
import SocialModal from "./socialModal.tsx";
import { FaCopy } from "react-icons/fa";
import KnowledgeBase from "./KnowledgeBase.tsx";
import Capabilities from "./Capabilities.tsx";

import { useParams } from "react-router-dom";
import { getMyAgentData } from "../../../services/agent.ts";
import { shortenAddress } from "../../../utils/index.ts";
import CopyButton from "../../common/copyButton.tsx";
export default function Agent() {
  const { agentId } = useParams<{ agentId: string | undefined }>();
  const [agentData, setAgentData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const getAgentData = async (agentId: string) => {
    try {
      const response = await getMyAgentData(agentId?.toString());
      setAgentData(response);
      setLoading(false);
    } catch (error: any) {
      NotificationMessage("error", error?.message);
    }
  };

  useEffect(() => {
    agentId && getAgentData(agentId);
  }, [agentId]);

  console.log("my agent", agentData);
  const onChange = (key: string | string[]) => {
    // console.log(key);
  };

  const items: CollapseProps["items"] = [
    {
      key: "1",
      label: "Details",
      children: (
        <div className='input_container'>
          <textarea
            rows={10}
            id='bio'
            placeholder='This is the short bio that will be shown at your agents profile.'
            defaultValue={agentData?.desc}
          />
        </div>
      ),
    },
    {
      key: "2",
      label: "Personality",
      children: (
        <div className='input_container'>
          <textarea
            rows={10}
            id='bio'
            placeholder='This is the short bio that will be shown at your agents profile.'
            defaultValue={agentData?.personality}
          />
        </div>
      ),
    },
    {
      key: "3",
      label: "Knowledge Base",
      children: <KnowledgeBase />,
    },
    {
      key: "4",
      label: "Capabilities",
      children: <Capabilities />,
    },
  ];

  if (loading) {
    return <div className='loading'>Loading...</div>;
  }

  return (
    <div className='agent_container'>
      <div className='basic'>
        <div className='content'>
          <div className='tokenlogo'>
            <img
              src={
                "https://img.freepik.com/free-photo/3d-rendering-animal-illustration_23-2151888074.jpg"
              }
              alt=''
            />
          </div>
          <div className='info'>
            <h2>
              {agentData?.name} <span>@{agentData?.token?.tkr}</span>
            </h2>

            <div className='social_tab'>
              <p>
                <span>{shortenAddress(agentData?.token.tCAddress)}</span>{" "}
                <CopyButton
                  text={agentData?.token.tCAddress}
                  className='copy-btn'
                />
              </p>
              <SocialModal
                discord={agentData?.discord}
                telegram={agentData?.telegram}
                x={agentData?.x}
              />
            </div>
          </div>
        </div>
      </div>
      <div className='form'>
        <Collapse
          defaultActiveKey={["3"]}
          onChange={onChange}
          expandIconPosition={"end"}
          items={items}
        />
      </div>
    </div>
  );
}
