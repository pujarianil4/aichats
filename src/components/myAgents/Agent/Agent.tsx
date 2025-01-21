import React from "react";
import "./agent.scss";
import { FaXTwitter } from "react-icons/fa6";
import { Collapse, Select } from "antd";
import type { CollapseProps } from "antd";
export default function Agent() {
  const onChange = (key: string | string[]) => {
    console.log(key);
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
          />
        </div>
      ),
    },
  ];

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
              Name <span>@Symbol</span>
            </h2>

            <div>
              <p>
                <span>0x456789</span> <FaXTwitter />
              </p>
              <p>
                <FaXTwitter /> <span>Twiiter</span>
              </p>
              <p>
                <FaXTwitter /> <span>Twiiter</span>
              </p>
              <p>
                <FaXTwitter /> <span>Twiiter</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className='form'>
        <Collapse
          defaultActiveKey={["1"]}
          onChange={onChange}
          expandIconPosition={"end"}
          items={items}
        />
      </div>
    </div>
  );
}
