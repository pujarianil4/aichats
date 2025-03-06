import { useState } from "react";
import "./agent.scss";
import { Collapse, Modal } from "antd";
import type { CollapseProps } from "antd";
import SocialModal from "./socialModal.tsx";
import KnowledgeBase from "./KnowledgeBase.tsx";
import Capabilities from "./Capabilities.tsx";
``;
import { LuPanelLeftClose } from "react-icons/lu";

import { shortenAddress } from "../../../utils/index.ts";
import CopyButton from "../../common/copyButton.tsx";
import UpdateAgent from "./updateAgent.tsx";
import { FiEdit } from "react-icons/fi";
import { BsCurrencyDollar } from "react-icons/bs";
import CreditPurchaseModal from "./creditModal/creditModal.tsx";
interface IProps {
  isEmulatorOpen: boolean;
  toggleEmulator: (bool?: boolean) => void;
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
  const changeEdit = (bool: boolean) => {
    setEdit(bool);
    if (bool) {
      toggleEmulator(false);
    }
  };

  const [modalVisible, setModalVisible] = useState(false);
  const handleOpenModal = () => {
    setModalVisible(true);
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
            value={agentData?.desc}
            disabled
            placeholder='This is the short bio that will be shown at your agents profile.'
            defaultValue={agentData?.desc}
          />
        </div>
      ),
    },
    {
      key: "2",
      label: "Persona",
      children: (
        <div className='collapse_item'>
          <textarea
            rows={10}
            id='bio'
            disabled
            placeholder='This is the short bio that will be shown at your agents profile.'
            defaultValue={agentData?.persona}
          />
        </div>
      ),
    },
    {
      key: "3",
      label: "Knowledge Base",
      children: <KnowledgeBase agentId={agentData?.id} />,
    },
    {
      key: "4",
      label: "Capabilities",
      children: <Capabilities />,
    },
  ];

  return (
    <>
      {edit ? (
        <UpdateAgent agentData={agentData} setIsEditing={changeEdit} />
      ) : (
        <div className='agent_container'>
          <div className='basic'>
            <div className='content'>
              <div className='tokenlogo'>
                <img src={agentData?.pic} alt='' />
              </div>
              <div className='info'>
                <h2>
                  {agentData?.name} <span>@{agentData?.token?.tkr}</span>
                  <span className='edit_btn' onClick={() => changeEdit(true)}>
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
                onClick={() => toggleEmulator()}
              />
            )}
            <div className='credits_card'>
              <div>
                <p className='total_creadits'>20</p>
                <p>
                  Credits <span>Active</span>
                </p>
              </div>
              <button onClick={handleOpenModal}>
                <BsCurrencyDollar /> Add Credits
              </button>
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

          <Modal
            title=''
            open={modalVisible}
            onCancel={() => setModalVisible(false)}
            footer={null}
            centered
            className='credit-modal'
          >
            <CreditPurchaseModal visible={modalVisible} />
          </Modal>
        </div>
      )}
    </>
  );
}
