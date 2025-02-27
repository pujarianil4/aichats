import React, { useCallback, useEffect, useRef, useState } from "react";
import "./updateAgent.scss";
import { Button, Popover, message } from "antd";
import Camera from "../../../assets/camera.png";
import { useImageNameValidator } from "../../../hooks/useImageNameValidator.tsx";
import { uploadSingleFile } from "../../../services/api.ts";
import { isAddress } from "viem";

import { FaChevronDown } from "react-icons/fa";
import { updateAgentData } from "../../../services/agent.ts";
import NotificationMessage from "../../common/notificationMessage.tsx";

import { IoArrowBack } from "react-icons/io5";
export const IMAGE_FILE_TYPES = "image/png, image/jpeg, image/webp, image/jpg";
interface IConversation {
  id: number;
  msgFor: string;
  msg: string;
}

type FormData = {
  name: string;
  ticker: string;
  profile: string;
  contractAddress: string;
  desc: string;
  persona: string;
  flowImage: string;
  agentType: string;
  search_engine_id: string;
  model_id: string;
};

export default function UpdateAgent({
  agentData,
  setIsEditing,
}: {
  agentData: any;
  setIsEditing: (val: boolean) => void;
}) {
  const { validateImage, error: err, clearError } = useImageNameValidator();
  const [loading, setLoading] = useState(false);

  const [hasChanged, setHasChanged] = useState(false);

  const [errorMsg, setErrorMsg] = useState({
    name: "",
    desc: "",
    contractAddress: "",
    persona: "",
  });
  const fileRefs = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    ticker: "",
    profile: "",
    contractAddress: "",
    desc: "",
    persona: "",
    flowImage: "",
    agentType: "none",
    search_engine_id: "none",
    model_id: "none",
  });

  useEffect(() => {
    if (agentData) {
      setFormData({
        name: agentData.name || "",
        ticker: agentData?.token?.tkr || "",
        profile: agentData.pic || "",
        contractAddress: agentData?.token?.tCAddress || "",
        desc: agentData.desc || "",
        persona: agentData.persona || "",
        agentType: agentData.typ || "none",
        search_engine_id: agentData.search_engine_id,
        model_id: agentData.model_id,
        flowImage: "",
      });
    }
  }, [agentData]);

  const isCreateAgentDisable =
    formData.name &&
    formData.desc &&
    formData.profile &&
    formData.ticker &&
    formData.contractAddress &&
    formData.persona &&
    formData.agentType != "none" &&
    formData.search_engine_id != "none" &&
    formData.model_id != "none";
  // (tabs == "new" ? formData.ticker : formData.contractAddress);
  const setFallbackURL = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.log("error", e);

    e.currentTarget.src = Camera;
  };

  const enforceBulletFormat = (value: string) => {
    // Split input into lines and force each line to start with a bullet point
    const lines = value.split("\n");
    const bulletPointRegex = /^-\s+/;
    const formattedLines = lines.map((line: string) => {
      if (line.trim() && !bulletPointRegex.test(line)) {
        // If the line doesn't start with bullet, prepend '- ' to it
        return `- ${line.trim()}`;
      }
      return line; // Keep lines that are already valid
    });

    // Join the lines back together with newlines
    console.log("instructions", formattedLines, formattedLines.join("\n"));
    return formattedLines.join("\n");
  };

  const handleInputChange = (key: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const uploadProfile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      try {
        const file = event.target.files[0];
        if (!validateImage(file)) {
          return;
        }
        const imgURL = await uploadSingleFile(file);
        console.log("image", imgURL);
        handleInputChange("profile", imgURL);

        //reset value to select same image again
        event.target.value = "";
      } catch (error) {
        event.target.value = "";
      }
    }
  };

  const formValidation = () => {
    const { name, desc, contractAddress, persona } = formData;

    const validations = [
      {
        condition: () => {
          const charLength = String(name).split("").length;
          return charLength >= 3 && charLength <= 20;
        },
        field: "name",
        errorMsg:
          "Name must be between 3 and 20 characters (excluding spaces).",
      },
      {
        condition: () => {
          const charLength = String(desc).split("").length;
          return charLength >= 150 && charLength <= 500;
        },
        field: "desc",
        errorMsg:
          "Description must be between 150 and 500 characters (excluding spaces).",
      },
      {
        condition: () => {
          const charLength = String(persona).split("").length;
          console.log(
            "charLength",
            charLength,
            charLength >= 50 && charLength <= 300
          );

          return charLength >= 100 && charLength <= 300; // Example validation range
        },
        field: "persona",
        errorMsg:
          "persona must be between 50 and 300 characters (excluding spaces).",
      },
      {
        condition: () => isAddress(contractAddress),
        field: "contractAddress",
        errorMsg:
          "Invalid contract address. Please enter a valid Ethereum address.",
      },
    ];

    let isValidate = true;

    validations.forEach(({ condition, field, errorMsg }) => {
      console.log("!condition()", field, !condition());

      if (!condition()) {
        setErrorMsg((prev) => ({ ...prev, [field]: errorMsg }));
        isValidate = false;
      } else {
        setErrorMsg((prev) => ({ ...prev, [field]: "" }));
      }
    });

    return isValidate;
  };

  const handleSubmit = async () => {
    console.log("Submitting Form Data:", formData);
    if (!formValidation()) return;

    try {
      setLoading(true);
      const updatedData = {
        name: formData.name || agentData.name,
        pic: formData.profile || agentData.imageUrl,
        desc: formData.desc || agentData.desc,
        persona: formData.persona || agentData.persona,
        search_engine_id:
          formData.search_engine_id || agentData.search_engine_id,
        model_id: formData.model_id || agentData.model_id,
        // typ: formData.agentType || agentData.typ,
      };
      console.log("sendData", updatedData);
      const response = await updateAgentData(agentData.id, updatedData);
      if (response) {
        NotificationMessage("success", "Agent Updated Successfully!");
      }
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      NotificationMessage("error", "Failed to Update Agent. Try Again");
    } finally {
      setLoading(false);
    }
  };

  // const checkForChanges = useCallback(() => {
  //   const fieldsToCheck: (keyof FormData)[] = [
  //     "name",
  //     "desc",
  //     "profile",
  //     "personality",
  //   ];

  //   const hasModification = fieldsToCheck.some((key) => {
  //     const formValue = formData[key]?.trim() || "";
  //     let agentValue = agentData[key] ?? "";

  //     // if (key === "instructions") {
  //     //   // Normalize instructions to a string before comparison
  //     //   agentValue = Array.isArray(agentValue)
  //     //     ? agentValue.join("\n")
  //     //     : agentValue;
  //     // }

  //     return formValue !== String(agentValue).trim();
  //   });

  //   console.log("Modification detected:", hasModification);
  //   setHasChanged(hasModification);
  // }, [formData, agentData]);

  // useEffect(() => {
  //   checkForChanges();
  // }, [formData, checkForChanges]);

  console.log("has chnages", hasChanged);
  return (
    <div className='update_agent_container'>
      <div className='update_title'>
        <span className='back_button' onClick={() => setIsEditing(false)}>
          <IoArrowBack />
        </span>
        <span className='heading'>Update AI Agent</span>
      </div>
      <div className='form'>
        <div className='profile'>
          <h4>Agent Details</h4>
          <div>
            <img
              onClick={() => fileRefs.current?.click()}
              src={formData.profile || Camera}
              onError={setFallbackURL}
              alt='logo'
            />
            <input
              ref={fileRefs}
              onChange={uploadProfile}
              type='file'
              accept={IMAGE_FILE_TYPES}
              name='img'
              style={{ visibility: "hidden", position: "absolute" }}
            />
            <div>
              <p>AI Agent</p>
              <p className='pic'>
                Profile Picture <span className='required'>*</span>{" "}
              </p>
            </div>
          </div>
        </div>

        <div className='update_info'>
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
            <span className='errormsg'>{errorMsg.name}</span>
          </div>
          {true && (
            <div className='input_container'>
              <label htmlFor='ticker'>
                Ticker <span className='required'>*</span>{" "}
              </label>
              <input
                value={formData.ticker}
                id='ticker'
                type='text'
                placeholder='$'
                disabled
              />
            </div>
          )}
          {true && (
            <div className='input_container'>
              <label htmlFor='contract_address'>
                Token Contract Address on BASE Chain{" "}
                <span className='required'>*</span>{" "}
              </label>
              <input
                id='contract_address'
                value={formData.contractAddress}
                type='text'
                placeholder=' Token Contract Address'
                disabled
              />
              <span className='errormsg'>{errorMsg.contractAddress}</span>
            </div>
          )}
          <div className='input_container'>
            <label htmlFor='bio'>
              AI Agent Description
              <span className='required'>*</span>{" "}
            </label>
            <textarea
              value={formData.desc}
              onChange={(e) => handleInputChange("desc", e.target.value)}
              rows={10}
              id='bio'
              placeholder='This is the short bio that will be shown at your agents profile.'
            />
            <span className='errormsg'>{errorMsg.desc}</span>
          </div>
          <div className='input_container'>
            <label htmlFor='personality'>
              Persona
              <span className='required'>*</span>{" "}
            </label>
            <textarea
              value={formData.persona}
              onChange={(e) => handleInputChange("persona", e.target.value)}
              rows={10}
              id='persona'
              placeholder='Short information about agent personality'
            />
            <span className='errormsg'>{errorMsg.persona}</span>
          </div>

          <div className='selection_container'>
            {/* <div className='input_container'>
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
                      "onchain",
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
            </div> */}
            <div className='input_container'>
              <label htmlFor='agenttype'>
                Search Engine
                <span className='required'>*</span>{" "}
              </label>
              <Popover
                content={
                  <div className='popover_select'>
                    {["none", "duckduckgo", "brave", "google"].map((type) => (
                      <p
                        key={type}
                        onClick={() =>
                          handleInputChange("search_engine_id", type)
                        }
                      >
                        {type}
                      </p>
                    ))}
                  </div>
                }
                trigger='click'
              >
                <div className='select'>
                  <p>{formData.search_engine_id}</p>
                  <FaChevronDown />
                </div>
              </Popover>
            </div>
            <div className='input_container'>
              <label htmlFor='agenttype'>
                AI Modal
                <span className='required'>*</span>{" "}
              </label>
              <Popover
                content={
                  <div className='popover_select'>
                    {["none", "llama-3.3-70b-versatile", "gpt-4o-mini"].map(
                      (type) => (
                        <p
                          key={type}
                          onClick={() => handleInputChange("model_id", type)}
                        >
                          {type}
                        </p>
                      )
                    )}
                  </div>
                }
                trigger='click'
              >
                <div className='select'>
                  <p>{formData.model_id}</p>
                  <FaChevronDown />
                </div>
              </Popover>
            </div>
          </div>

          <Button
            disabled={!isCreateAgentDisable}
            // disabled={!isCreateAgentDisable || !hasChanged}
            onClick={handleSubmit}
            type='primary'
            loading={loading}
          >
            Update Agent
          </Button>
        </div>
      </div>
    </div>
  );
}
