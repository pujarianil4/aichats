import React, { useState } from "react";
import { isAddress } from "viem";
import { createInstance } from "../../services/api.ts";
import { useNavigate } from "react-router-dom";
import "./index.scss";
import { FaChevronDown } from "react-icons/fa";
import { Popover } from "antd";

interface FormData {
  name: string;
  adminAddress: string;
  aId: string;
  streamUrl: string;
  moderators: string[];
  tokenAddress: string;
  minTokenValue: number;
  chainId: string;
}

const ChatInstanceForm: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    adminAddress: "",
    aId: "",
    streamUrl: "",
    moderators: [],
    tokenAddress: "",
    minTokenValue: 0,
    chainId: "",
  });

  const [errors, setErrors] = useState({
    adminAddress: "",
    moderators: "",
    tokenAddress: "",
  });

  const chainOptions = [
    { label: "Ethereum", value: "1" },
    { label: "Base", value: "8453" },
    { label: "Arbitrun", value: "42161" },
    { label: "Polygon", value: "137" },
  ];

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: name === "minTokenValue" ? Number(value) : value,
    });
  };

  const handleChainSelect = (value: string) => {
    setFormData({ ...formData, chainId: value });
  };

  const handleModeratorsChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { value } = event.target;
    // const items = value.split("\n").filter((item) => item.trim() !== "");
    const items = value.split(/\s+/).filter((item) => item.trim() !== "");
    setFormData({ ...formData, moderators: items });
  };

  const validateAddress = (address: string): boolean => {
    return isAddress(address);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const adminAddressValid = validateAddress(formData.adminAddress);
    const tokenAddressValid = validateAddress(formData.tokenAddress);
    const invalidModerators = formData.moderators.filter(
      (address) => !validateAddress(address)
    );

    setErrors({
      adminAddress: adminAddressValid ? "" : "Invalid admin address",
      tokenAddress: tokenAddressValid ? "" : "Invalid token address",
      moderators:
        invalidModerators.length > 0
          ? "One or more moderator addresses are invalid"
          : "",
    });

    if (
      !adminAddressValid ||
      !tokenAddressValid ||
      invalidModerators.length > 0
    ) {
      return;
    }

    try {
      const res = await createInstance(formData);
      navigate(`/agent/${res?.aId}`);
    } catch (error) {
      console.log("FAILED TO CREATE INSTANCE", error);
    }
  };

  const popoverContent = (
    <div className='popover_select'>
      {chainOptions.map((option) => (
        <p
          className='select_item'
          key={option.value}
          onClick={() => handleChainSelect(option.value)}
        >
          {option.label}
        </p>
      ))}
    </div>
  );

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          Name<span>*</span>
        </label>
        <input
          type='text'
          name='name'
          value={formData.name}
          onChange={handleInputChange}
          required
        />
      </div>

      <div>
        <label>
          Admin Address<span>*</span>
        </label>
        <input
          type='text'
          name='adminAddress'
          value={formData.adminAddress}
          onChange={handleInputChange}
          required
        />
        {errors.adminAddress && (
          <p style={{ color: "red" }}>{errors.adminAddress}</p>
        )}
      </div>

      <div>
        <label>
          Agent ID<span>*</span>
        </label>
        <input
          type='text'
          name='aId'
          value={formData.aId}
          onChange={handleInputChange}
          required
        />
      </div>

      <div>
        <label>
          Stream Link<span>*</span>
        </label>
        <input
          type='text'
          name='streamUrl'
          value={formData.streamUrl}
          onChange={handleInputChange}
          required
        />
      </div>

      {/* <div>
        <label>
          Moderators:
          <textarea
            name='moderators'
            value={formData.moderators.join("\n")}
            onChange={handleModeratorsChange}
            placeholder='Enter each address separated by a space or on a new line'
          />
        </label>
        {errors.moderators && (
          <p style={{ color: "red" }}>{errors.moderators}</p>
        )}
      </div> */}
      <div>
        <label>
          Moderators<span>*</span>
        </label>
        <textarea
          name='moderators'
          // value={formData.moderators}
          onChange={handleModeratorsChange}
          placeholder='Enter each address separated by a space or on a new line'
        />
        {errors.moderators && (
          <p style={{ color: "red" }}>{errors.moderators}</p>
        )}
      </div>

      <div>
        <label>
          Token Address<span>*</span>
        </label>
        <input
          type='text'
          name='tokenAddress'
          value={formData.tokenAddress}
          onChange={handleInputChange}
          required
        />
        {errors.tokenAddress && (
          <p style={{ color: "red" }}>{errors.tokenAddress}</p>
        )}
      </div>

      <div>
        <label>
          Minimum Token Value<span>*</span>
        </label>
        <input
          type='number'
          name='minTokenValue'
          value={formData.minTokenValue}
          onChange={handleInputChange}
          required
        />
      </div>

      <div>
        <label>
          Chain ID<span>*</span>
        </label>
        {/* <select
          name='chainId'
          value={formData.chainId}
          onChange={handleInputChange}
          required
        >
          <option value='' disabled>
            Select a Chain
          </option>
          {chainOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select> */}

        <Popover content={popoverContent} trigger='click'>
          <div className='select'>
            <p className='select_item'>
              {chainOptions.find((option) => option.value === formData.chainId)
                ?.label || "Select a Chain"}
            </p>
            <FaChevronDown />
          </div>
        </Popover>
      </div>

      <button type='submit'>Submit</button>
    </form>
  );
};

export default ChatInstanceForm;
