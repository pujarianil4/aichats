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
``;
import { LuPanelLeftClose } from "react-icons/lu";

import { useParams } from "react-router-dom";
import { getMyAgentData } from "../../../services/agent.ts";
import { shortenAddress } from "../../../utils/index.ts";
import CopyButton from "../../common/copyButton.tsx";
import UpdateAgent from "./updateAgent.tsx";
import { FiEdit } from "react-icons/fi";
interface IProps {
  isEmulatorOpen: boolean;
  toggleEmulator: () => void;
  agent: any;
}

export default function Agent({
  isEmulatorOpen,
  toggleEmulator,
  agent,
}: IProps) {
  const { data: agentData, isLoading } = agent;
  const [edit, setEdit] = useState<boolean>(false);
  const onChange = (key: string | string[]) => {
    // console.log(key);
  };
  const changeEdit = () => {
    setEdit((prev) => !prev);
  };

  const items: CollapseProps["items"] = [
    {
      key: "1",
      label: "Details",
      children: (
        <div className='collapse_item'>
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
        <div className='collapse_item'>
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
      children: <KnowledgeBase agentId={agentData.id} />,
    },
    {
      key: "4",
      label: "Capabilities",
      children: <Capabilities />,
    },
  ];

  if (isLoading) {
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
                <img src={agentData.pic} alt='' />
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
            {!isEmulatorOpen && (
              <LuPanelLeftClose
                size={18}
                className='toggle_btn'
                onClick={toggleEmulator}
              />
            )}
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
      )}
    </>
  );
}
