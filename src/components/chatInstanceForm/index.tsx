import React, { useState } from "react";
import { isAddress } from "viem";
import { createInstance } from "../../services/api.ts";

interface FormData {
  name: string;
  adminAddress: string;
  moderators: string[];
  tokenAddress: string;
  minTokenValue: number;
  chainId: string;
}

const ChatInstanceForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    adminAddress: "",
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

  const handleModeratorsChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { value } = event.target;
    //const items = value.split("\n").filter((item) => item.trim() !== ""
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
      console.log("Form Data:", formData);
      await createInstance(formData);
    } catch (error) {
      console.log("FAILED TO CREATE INSTANCE", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          Name:
          <input
            type='text'
            name='name'
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </label>
      </div>

      <div>
        <label>
          Admin Address:
          <input
            type='text'
            name='adminAddress'
            value={formData.adminAddress}
            onChange={handleInputChange}
            required
          />
        </label>
        {errors.adminAddress && (
          <p style={{ color: "red" }}>{errors.adminAddress}</p>
        )}
      </div>

      <div>
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
      </div>

      <div>
        <label>
          Token Address:
          <input
            type='text'
            name='tokenAddress'
            value={formData.tokenAddress}
            onChange={handleInputChange}
            required
          />
        </label>
        {errors.tokenAddress && (
          <p style={{ color: "red" }}>{errors.tokenAddress}</p>
        )}
      </div>

      <div>
        <label>
          Minimum Token Value:
          <input
            type='number'
            name='minTokenValue'
            value={formData.minTokenValue}
            onChange={handleInputChange}
            required
          />
        </label>
      </div>

      <div>
        <label>
          Chain ID:
          <select
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
          </select>
        </label>
      </div>

      <button type='submit'>Submit</button>
    </form>
  );
};

export default ChatInstanceForm;
