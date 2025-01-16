import React, { useEffect, useState } from "react";
import "./index.scss";
import { Button, Select, Popover } from "antd";
import type { TabsProps } from "antd";
import { FaCaretUp, FaChevronDown } from "react-icons/fa";
import { BsDashCircle } from "react-icons/bs";

import { GoArrowSwitch } from "react-icons/go";
import CustomTabs from "../common/Tabs/Tabs.tsx";

interface IConversation {
  id: number;
  msgFor: string;
  msg: string;
}

type EnvironmentPrompts = {
  forum: { prefix: string; suffix: string };
  twitter: { prefix: string; suffix: string };
  telegram: { prefix: string; suffix: string };
  livestream: { prefix: string; suffix: string };
};

type FormData = {
  name: string;
  ticker: string;
  contractAddress: string;
  bio: string;
  agentType: string;
  greeting: string;
  environmentPrompts: EnvironmentPrompts;
  sampleConversations: IConversation[];
};

export default function CreateAgent() {
  const [isViewMore, setIsViewMore] = useState(false);
  const [tabs, setTabs] = useState("new");
  const [agentType, setAgentType] = useState("none");
  const [sampleConversations, setSampleConversation] = useState<
    Array<IConversation>
  >([]);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    ticker: "",
    contractAddress: "",
    bio: "",
    agentType: "none",
    greeting: "",
    environmentPrompts: {
      forum: { prefix: "", suffix: "" },
      twitter: { prefix: "", suffix: "" },
      telegram: { prefix: "", suffix: "" },
      livestream: { prefix: "", suffix: "" },
    },
    sampleConversations: [],
  });

  const handleInputChange = (key: string, value: string | Array<any>) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleAddSampleCov = () => {
    const added = [
      ...sampleConversations,
      { id: sampleConversations.length + 1, msgFor: "User", msg: "" },
    ];
    setSampleConversation(added);
    handleInputChange("sampleConversations", added);
  };
  const handleEnvironmentPromptChange = (
    platform: keyof EnvironmentPrompts,
    field: string,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      environmentPrompts: {
        ...prev.environmentPrompts,
        [platform]: {
          ...prev.environmentPrompts[platform],
          [field]: value,
        },
      },
    }));
  };
  const handleMsgFor = (id: any, user: string) => {
    const updated = sampleConversations.map((con) =>
      con.id == id ? { ...con, msgFor: user } : con
    );
    handleInputChange("sampleConversations", updated);
    setSampleConversation(updated);
  };

  const handleSampleMsg = (id: any, msg: string) => {
    const updated = sampleConversations.map((con) =>
      con.id == id ? { ...con, msg: msg } : con
    );
    handleInputChange("sampleConversations", updated);
    setSampleConversation(updated);
  };

  const handleRemoveSample = (id: number) => {
    const updated = sampleConversations.filter((con) => con.id != id);
    setSampleConversation(updated);
    handleInputChange("sampleConversations", updated);
  };

  const handleSubmit = () => {
    console.log("Form Data Submitted:", formData, sampleConversations);
    // Handle form submission logic, like sending to an API.
  };
  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Forum Prompt",
      children: (
        <div className='tab_content'>
          <div className='area'>
            <label htmlFor='name'>Environment Prompt Prefix</label>
            <textarea
              rows={5}
              value={formData.environmentPrompts["forum"].prefix}
              onChange={(e) =>
                handleEnvironmentPromptChange("forum", "prefix", e.target.value)
              }
              id='bio'
              placeholder='This is the short bio that will be shown at your agents profile.'
            />
          </div>

          <div className='divider'></div>
          <div className='area'>
            <label htmlFor='name'>Environment Prompt Suffix</label>
            <textarea
              rows={5}
              value={formData.environmentPrompts["forum"].suffix}
              onChange={(e) =>
                handleEnvironmentPromptChange("forum", "suffix", e.target.value)
              }
              id='bio'
              placeholder='This is the short bio that will be shown at your agents profile.'
            />
          </div>
        </div>
      ),
    },
    {
      key: "2",
      label: "X(twitter) Prompt",
      children: (
        <div className='tab_content'>
          <div className='area'>
            <label htmlFor='name'>Environment Prompt Prefix</label>
            <textarea
              rows={5}
              value={formData.environmentPrompts["twitter"].prefix}
              onChange={(e) =>
                handleEnvironmentPromptChange(
                  "twitter",
                  "prefix",
                  e.target.value
                )
              }
              id='bio'
              placeholder='This is the short bio that will be shown at your agents profile.'
            />
          </div>

          <div className='divider'></div>
          <div className='area'>
            <label htmlFor='name'>Environment Prompt Suffix</label>
            <textarea
              rows={5}
              id='bio'
              value={formData.environmentPrompts["twitter"].suffix}
              onChange={(e) =>
                handleEnvironmentPromptChange(
                  "twitter",
                  "suffix",
                  e.target.value
                )
              }
              placeholder='This is the short bio that will be shown at your agents profile.'
            />
          </div>
        </div>
      ),
    },
    {
      key: "3",
      label: "Telegram Prompt",
      children: (
        <div className='tab_content'>
          <div className='area'>
            <label htmlFor='name'>Environment Prompt Prefix</label>
            <textarea
              rows={5}
              value={formData.environmentPrompts["telegram"].prefix}
              onChange={(e) =>
                handleEnvironmentPromptChange(
                  "telegram",
                  "prefix",
                  e.target.value
                )
              }
              id='bio'
              placeholder='This is the short bio that will be shown at your agents profile.'
            />
          </div>

          <div className='divider'></div>
          <div className='area'>
            <label htmlFor='name'>Environment Prompt Suffix</label>
            <textarea
              rows={5}
              value={formData.environmentPrompts["telegram"].suffix}
              onChange={(e) =>
                handleEnvironmentPromptChange(
                  "telegram",
                  "suffix",
                  e.target.value
                )
              }
              id='bio'
              placeholder='This is the short bio that will be shown at your agents profile.'
            />
          </div>
        </div>
      ),
    },
    {
      key: "4",
      label: "Livestream Prompt",
      children: (
        <div className='tab_content'>
          <div className='area'>
            <label htmlFor='name'>Environment Prompt Prefix</label>
            <textarea
              rows={5}
              value={formData.environmentPrompts["livestream"].prefix}
              onChange={(e) =>
                handleEnvironmentPromptChange(
                  "livestream",
                  "prefix",
                  e.target.value
                )
              }
              id='bio'
              placeholder='This is the short bio that will be shown at your agents profile.'
            />
          </div>

          <div className='divider'></div>
          <div className='area'>
            <label htmlFor='name'>Environment Prompt Suffix</label>
            <textarea
              rows={5}
              value={formData.environmentPrompts["livestream"].suffix}
              onChange={(e) =>
                handleEnvironmentPromptChange(
                  "livestream",
                  "suffix",
                  e.target.value
                )
              }
              id='bio'
              placeholder='This is the short bio that will be shown at your agents profile.'
            />
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className='create_agent_container'>
      <div className='title'>
        <h2>Create New AI Agent</h2>
        <div className='tabs'>
          <p
            onClick={() => setTabs("new")}
            className={tabs == "new" ? "active" : ""}
          >
            New Token
          </p>
          <p
            onClick={() => setTabs("existing")}
            className={tabs == "existing" ? "active" : ""}
          >
            Existing Token
          </p>
        </div>
      </div>
      <div className='form'>
        <div className='profile'>
          <h4>Agent Details</h4>
          <div>
            <img src='./logo.png' alt='logo' />
            <div>
              <p>AI Agent</p>
              <p className='pic'>
                Profile Picture <span className='required'>*</span>{" "}
              </p>
            </div>
          </div>
        </div>

        <div className='basic_info'>
          <div className='input_container'>
            <label htmlFor='name'>
              AI Agent Name <span className='required'>*</span>{" "}
            </label>
            <input
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              id='name'
              type='text'
              placeholder='Agent Name'
            />
          </div>
          {tabs == "new" && (
            <div className='input_container'>
              <label htmlFor='ticker'>
                Ticker <span className='required'>*</span>{" "}
              </label>
              <input
                value={formData.ticker}
                onChange={(e) => handleInputChange("ticker", e.target.value)}
                id='ticker'
                type='text'
                placeholder='$'
              />
            </div>
          )}
          {tabs == "existing" && (
            <div className='input_container'>
              <label htmlFor='contract_address'>
                Token Contract Address on BASE Chain{" "}
                <span className='required'>*</span>{" "}
              </label>
              <input
                id='contract_address'
                value={formData.contractAddress}
                onChange={(e) =>
                  handleInputChange("contractAddress", e.target.value)
                }
                type='text'
                placeholder=' Token Contract Address'
              />
            </div>
          )}
          <div className='input_container'>
            <label htmlFor='bio'>
              AI Agent Biography
              <span className='required'>*</span>{" "}
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) => handleInputChange("bio", e.target.value)}
              rows={10}
              id='bio'
              placeholder='This is the short bio that will be shown at your agents profile.'
            />
          </div>
          <div className='input_container'>
            <label htmlFor='agenttype'>
              Agent Type
              <span className='required'>*</span>{" "}
            </label>
            <Popover
              content={
                <div className='popover_select'>
                  {[
                    "none",
                    "productivity",
                    "entertainment",
                    "on-chain",
                    "information",
                    "creative",
                  ].map((type) => (
                    <p
                      key={type}
                      onClick={() => handleInputChange("agentType", type)}
                    >
                      {type}
                    </p>
                  ))}
                </div>
              }
              trigger='click'
            >
              <div className='select'>
                <p>{formData.agentType}</p>
                <FaChevronDown />
              </div>
            </Popover>
          </div>
          <div
            className='viewmore'
            style={isViewMore ? { height: "max-content" } : { height: "0px" }}
          >
            <div className='input_container'>
              <label htmlFor='greeting'>
                Greeting Message
                <span className='required'>*</span>{" "}
              </label>
              <textarea
                rows={5}
                value={formData.greeting}
                onChange={(e) => handleInputChange("greeting", e.target.value)}
                id='greeting'
                placeholder='Hello, How are you ?'
              />
            </div>
            <div className='tabs_container'>
              <CustomTabs items={items} />
              <div className='conversation'>
                <div className='_title'>
                  <p>Sample Conversation</p>
                </div>
                <div className='_conversation'>
                  <div>
                    {sampleConversations.map((con: IConversation) => (
                      <SampleConversation
                        key={con.id}
                        handleMsgFor={handleMsgFor}
                        handleSampleMsg={handleSampleMsg}
                        handleRemoveSample={handleRemoveSample}
                        conversation={con}
                      />
                    ))}
                  </div>
                  <div className='btn'>
                    <Button onClick={handleAddSampleCov} icon={<span>+</span>}>
                      Add Message
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='more_options'>
            <p onClick={() => setIsViewMore(!isViewMore)}>
              {!isViewMore ? "Advance Settings" : "Show less options"}
              <span>
                <FaCaretUp />
              </span>
            </p>
          </div>
          <Button onClick={handleSubmit} type='primary'>
            Create Agent
          </Button>
        </div>
      </div>
    </div>
  );
}

const SampleConversation = ({
  handleMsgFor,
  handleSampleMsg,
  handleRemoveSample,
  conversation,
}: {
  conversation: IConversation;
  handleMsgFor: (id: number, user: string) => void;
  handleSampleMsg: (id: number, msg: string) => void;
  handleRemoveSample: (id: number) => void;
}) => {
  const handleChange = () => {
    const switchedTo = conversation.msgFor == "User" ? "Assistant" : "User";
    handleMsgFor(conversation.id, switchedTo);
  };

  const handleMsg = (txt: string) => {
    handleSampleMsg(conversation.id, txt);
  };

  return (
    <div className='cov_sample'>
      <p onClick={handleChange}>
        <span>{conversation.msgFor} </span>
        <span>
          <GoArrowSwitch />
        </span>{" "}
      </p>
      <input
        onChange={(e) => handleMsg(e.target.value)}
        value={conversation.msg}
        type='text'
        placeholder={`Enter ${conversation.msgFor} Message`}
      />
      <BsDashCircle onClick={() => handleRemoveSample(conversation.id)} />
    </div>
  );
};
