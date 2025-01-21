import React, { useState } from "react";
import "./index.scss";
import { FaChevronDown } from "react-icons/fa";
import { Popover } from "antd";
export default function MagicBuild() {
  const [formData, setFormData] = useState({
    name: "",
    typ: "Base",
  });

  const handleInputChange = (key: string, value: string | Array<any>) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className='magic_build_container'>
      <div className='title'>
        <h2>Create New AI Agent</h2>
      </div>
      <div className='content'>
        <h4>Agent Details</h4>
        <div className='form_inputs'>
          <div className='input_container flex_grow'>
            <label>
              Name
              <span className='required'>*</span>{" "}
            </label>
            <input
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              type='text'
              placeholder='Enter Agent Name'
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
                  {["Base", "Solana", "Polygon", "BNB"].map((type) => (
                    <p
                      key={type}
                      onClick={() => handleInputChange("typ", type)}
                    >
                      {type}
                    </p>
                  ))}
                </div>
              }
              trigger='click'
            >
              <div className='select'>
                <p>{formData.typ}</p>
                <FaChevronDown />
              </div>
            </Popover>
          </div>
        </div>
        <button>Create AI Agent</button>
      </div>
    </div>
  );
}
