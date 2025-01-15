import React, { useState } from "react";
import "./index.scss";
import { Button, Select, Popover } from "antd";
import { FaCaretUp, FaChevronDown } from "react-icons/fa";

export default function CreateAgent() {
  const [isViewMore, setIsViewMore] = useState(false);
  const [tabs, setTabs] = useState("new");
  const [agentType, setAgentType] = useState("none");
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
            <input id='name' type='text' placeholder='Agent Name' />
          </div>
          {tabs == "new" && (
            <div className='input_container'>
              <label htmlFor='ticker'>
                Ticker <span className='required'>*</span>{" "}
              </label>
              <input id='ticker' type='text' placeholder='$' />
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
              rows={10}
              id='bio'
              placeholder=' Token Contract Address'
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
                  <p onClick={() => setAgentType("none")}>None</p>
                  <p onClick={() => setAgentType("productivity")}>
                    Productivity
                  </p>
                  <p onClick={() => setAgentType("pntertaintment")}>
                    Entertaintment
                  </p>
                </div>
              }
              trigger='click'
            >
              <div className='select'>
                <p>{agentType}</p>
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
                rows={10}
                id='greeting'
                placeholder=' Token Contract Address'
              />
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
          <Button type='primary'>Create Agent</Button>
        </div>
      </div>
    </div>
  );
}
