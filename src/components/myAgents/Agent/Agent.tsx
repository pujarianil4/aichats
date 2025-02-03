import React, { useState, useEffect } from "react";
import "./agent.scss";

import { Collapse, Select } from "antd";
import type { CollapseProps } from "antd";
import NotificationMessage from "../../common/notificationMessage.tsx";
import SocialModal from "./socialModal.tsx";
import { FiEdit } from "react-icons/fi";
import KnowledgeBase from "./KnowledgeBase.tsx";
import Capabilities from "./Capabilities.tsx";

import { useParams } from "react-router-dom";
import { getMyAgentData } from "../../../services/agent.ts";
import { shortenAddress } from "../../../utils/index.ts";
import CopyButton from "../../common/copyButton.tsx";
import UpdateAgent from "./updateAgent.tsx";

export default function Agent() {
  const { agentId } = useParams<{ agentId: string | undefined }>();
  const [agentData, setAgentData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [edit, setEdit] = useState<boolean>(false);

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
    if (agentId) getAgentData(agentId);
  }, [agentId]);

  const onChange = (key: string | string[]) => {
    // Handle collapse changes if needed
  };

  const changeEdit = () => {
    setEdit((prev) => !prev);
  };

  if (loading) {
    return <div className='loading'>Loading...</div>;
  }

  return (
    <>
      {edit ? (
        <UpdateAgent agentData={agentData} setIsEditing={setEdit} />
      ) : (
        <div className='agent_container'>
          <div className='basic'>
            <div className='content'>
              <div className='tokenlogo'>
                <img
                  src={
                    "https://img.freepik.com/free-photo/3d-rendering-animal-illustration_23-2151888074.jpg"
                  }
                  alt='Agent Logo'
                />
              </div>
              <div className='info'>
                <h2>
                  {agentData?.name} <span>@{agentData?.token?.tkr}</span>
                  <span className='edit_btn' onClick={changeEdit}>
                    <FiEdit /> Edit
                  </span>
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
              items={[
                {
                  key: "1",
                  label: "Details",
                  children: (
                    <div className='input_container'>
                      <textarea
                        rows={10}
                        id='bio'
                        placeholder="This is the short bio that will be shown at your agent's profile."
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
                        placeholder="This is the short bio that will be shown at your agent's profile."
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
              ]}
            />
          </div>
        </div>
      )}
    </>
  );
}
