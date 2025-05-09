import React, { useRef, useState } from "react";
import "./index.scss";
import { Button, Popover, message, Modal } from "antd";

import { FaChevronDown } from "react-icons/fa";
import { BsDashCircle } from "react-icons/bs";
import Camera from "../../assets/camera.png";
import superchatSS from "../../assets/superchat.png";
import { GoArrowSwitch } from "react-icons/go";
import { FiUpload } from "react-icons/fi";
import { useImageNameValidator } from "../../hooks/useImageNameValidator.tsx";
import { createAgent, uploadSingleFile } from "../../services/api.ts";
import { Address, erc20Abi, isAddress } from "viem";
import { readContract } from "wagmi/actions";
import { wagmiConfig } from "../../main.tsx";
import { useNavigate } from "react-router-dom";
import CustomCarousel from "../common/Carousel/Carousel.tsx";
export const IMAGE_FILE_TYPES = "image/png, image/jpeg, image/webp, image/jpg";
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
  profile: string;
  contractAddress: string;
  desc: string;
  instructions: string;
  persona: string;
  flowImage: string;
  agentType: string;
  search_engine_id: string;
  model_id: string;
  interfaceType: string; // TODO update with exact type
  // greeting: string;
  // environmentPrompts: EnvironmentPrompts;
  // sampleConversations: IConversation[];
};

export default function CreateAgent() {
  const navigate = useNavigate();
  const [isViewMore, setIsViewMore] = useState(false);
  const [tabs, setTabs] = useState("new");
  const { validateImage, error: err, clearError } = useImageNameValidator();
  const [loading, setLoading] = useState(false);
  const [sampleConversations, setSampleConversation] = useState<
    Array<IConversation>
  >([]);
  const [errorMsg, setErrorMsg] = useState({
    desc: "",
    contractAddress: "",
    persona: "",
  });
  const [isProfileUploading, setIsProfileUploading] = useState<boolean>(false);
  const [isFlowUploading, setIsFlowUploading] = useState<boolean>(false);
  const fileRefs = useRef<HTMLInputElement>(null);
  const flowFileRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    ticker: "",
    profile: "",
    contractAddress: "",
    desc: "",
    instructions: "",
    persona: "",
    flowImage: "",
    agentType: "none",
    search_engine_id: "none",
    model_id: "none",
    interfaceType: "",
    // greeting: "",
    // environmentPrompts: {
    //   forum: { prefix: "", suffix: "" },
    //   twitter: { prefix: "", suffix: "" },
    //   telegram: { prefix: "", suffix: "" },
    //   livestream: { prefix: "", suffix: "" },
    // },
    // sampleConversations: [],
  });
  const [modalVisible, setModalVisible] = useState(false);
  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const isCreateAgentDisable =
    formData.name &&
    formData.desc &&
    formData.profile &&
    formData.ticker &&
    formData.contractAddress &&
    formData.persona &&
    formData.agentType != "none" &&
    formData.search_engine_id != "none" &&
    formData.model_id != "none" &&
    formData.interfaceType;

  // (tabs == "new" ? formData.ticker : formData.contractAddress);
  const setFallbackURL = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.log("error", e);

    e.currentTarget.src = Camera;
  };

  const resetForm = () => {
    setFormData({
      name: "",
      ticker: "",
      profile: "",
      contractAddress: "",
      desc: "",
      instructions: "",
      persona: "",
      flowImage: "",
      agentType: "none",
      search_engine_id: "none",
      model_id: "none",
      interfaceType: "",
    });
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
  const handleInputChange = async (key: string, value: string) => {
    if (key == "instructions") {
      const formattedValue = enforceBulletFormat(value);

      setFormData((prev) => ({
        ...prev,
        [key]: formattedValue,
      }));
    } else if (key == "contractAddress") {
      if (value == "") {
        setErrorMsg((prev) => ({
          ...prev,
          contractAddress: "",
        }));
      }

      setFormData((prev) => ({
        ...prev,
        [key]: value,
      }));
      if (isAddress(value)) {
        await getTokenDetails(value);
      } else if (value) {
        setErrorMsg((prev) => ({
          ...prev,
          contractAddress:
            "Invalid contract address. Please enter a valid Ethereum address.",
        }));
      }
    } else if (key === "persona") {
      const charLength = value.trim().length;
      setFormData((prev) => ({
        ...prev,
        [key]: value,
      }));

      setErrorMsg((prev) => ({
        ...prev,
        persona:
          charLength < 50 || charLength > 300
            ? "Persona must be between 50 and 300 characters (excluding spaces)."
            : "",
      }));
    } else if (key === "desc") {
      const charLength = value.trim().length;
      setFormData((prev) => ({
        ...prev,
        [key]: value,
      }));
      setErrorMsg((prev) => ({
        ...prev,
        desc:
          charLength < 150 || charLength > 500
            ? "Description must be between 150 and 500 characters (excluding spaces)."
            : "",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [key]: value,
      }));
    }
  };

  const getTokenDetails = async (addr: Address) => {
    try {
      const token = await readContract(wagmiConfig, {
        abi: erc20Abi,
        address: addr,
        functionName: "symbol",
      });
      console.log("Token", token);
      setFormData((prev) => ({
        ...prev,
        ["ticker"]: token,
      }));
      setErrorMsg((prev) => ({
        ...prev,
        contractAddress: "",
      }));
    } catch (error) {
      console.log(error);
      setErrorMsg((prev) => ({
        ...prev,
        contractAddress:
          "Invalid contract address. Please enter a valid Ethereum address.",
      }));
    }
  };

  // const handleAddSampleCov = () => {
  //   const added = [
  //     ...sampleConversations,
  //     { id: sampleConversations.length + 1, msgFor: "User", msg: "" },
  //   ];
  //   setSampleConversation(added);
  //   handleInputChange("sampleConversations", added);
  // };
  // const handleEnvironmentPromptChange = (
  //   platform: keyof EnvironmentPrompts,
  //   field: string,
  //   value: string
  // ) => {
  //   setFormData((prev) => ({
  //     ...prev,
  //     environmentPrompts: {
  //       ...prev.environmentPrompts,
  //       [platform]: {
  //         ...prev.environmentPrompts[platform],
  //         [field]: value,
  //       },
  //     },
  //   }));
  // };
  // const handleMsgFor = (id: any, user: string) => {
  //   const updated = sampleConversations.map((con) =>
  //     con.id == id ? { ...con, msgFor: user } : con
  //   );
  //   handleInputChange("sampleConversations", updated);
  //   setSampleConversation(updated);
  // };

  // const handleSampleMsg = (id: any, msg: string) => {
  //   const updated = sampleConversations.map((con) =>
  //     con.id == id ? { ...con, msg: msg } : con
  //   );
  //   handleInputChange("sampleConversations", updated);
  //   setSampleConversation(updated);
  // };

  // const handleRemoveSample = (id: number) => {
  //   const updated = sampleConversations.filter((con) => con.id != id);
  //   setSampleConversation(updated);
  //   handleInputChange("sampleConversations", updated);
  // };

  const uploadProfile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setIsProfileUploading(true);
      console.log("upload  profile");
      try {
        const file = event.target.files[0];
        if (!validateImage(file)) {
          setIsProfileUploading(false);
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
      setIsProfileUploading(false);
      //setImgSrc(imgURL);
    }
  };
  const uploadFlow = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setIsFlowUploading(true);
      try {
        const file = event.target.files[0];
        if (!validateImage(file)) {
          setIsFlowUploading(false);
          return;
        }

        const imgURL = await uploadSingleFile(file);
        console.log("image", imgURL);
        handleInputChange("flowImage", imgURL);

        //reset value to select same image again
        event.target.value = "";
      } catch (error) {
        event.target.value = "";
      }
      setIsFlowUploading(false);
      //setImgSrc(imgURL);
    }
  };

  const handleSelect = (value: string) => {
    setModalVisible(false);
    setFormData({ ...formData, interfaceType: value });
  };

  const formValidation = () => {
    const { desc, contractAddress, persona } = formData;

    const validations = [
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
            String(persona).split(""),
            charLength,
            charLength >= 50 && charLength <= 300
          );

          return charLength >= 50 && charLength <= 300; // Example validation range
        },
        field: "persona",
        errorMsg:
          "persona must be between 100 and 300 characters (excluding spaces).",
      },
      {
        condition: () => isAddress(contractAddress),
        field: "contractAddress",
        errorMsg:
          "Invalid contract address. Please enter a valid Ethereum address.",
      },
    ];

    let isValidate = true;

    // Loop through validations and update errors
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
    console.log("Form Data Submitted:", formData);

    try {
      if (formValidation()) {
        const data = {
          name: formData.name,
          pic: formData.profile,
          token: {
            tkr: formData.ticker,
            tCAddress: formData.contractAddress,
          },
          desc: formData.desc,
          persona: formData.persona,
          search_engine_id: formData.search_engine_id,
          model_id: formData.model_id,
          interfaceType: formData.interfaceType,

          // instructions: formData.instructions
          //   .split("\n")
          //   .map((line) => line.replace(/^-\s*/, "").trim()),
          // flowImage: formData.flowImage,
          typ: formData.agentType,
        };
        console.log("Form Data Submitted:", data);
        setLoading(true);
        const res = await createAgent(data);
        console.log("result", res);
        navigate(`/myagent/${res.id}`);
        resetForm();
        message.success("Agent Created Successfully!");
      }
    } catch (error) {
      message.error("Failed to Create Agent. Try Again");
    } finally {
      setLoading(false);
    }

    // Handle form submission logic, like sending to an API.
  };

  const contentStyle: React.CSSProperties = {
    margin: 0,
    height: "160px",
    color: "#fff",
    lineHeight: "160px",
    textAlign: "center",
    background: "#364d79",
  };

  return (
    <>
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
                name='profileImg'
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

            {true && (
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
                <span className='errormsg'>{errorMsg.contractAddress}</span>
              </div>
            )}

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
              <label htmlFor='persona'>
                Persona
                <span className='required'>*</span>{" "}
              </label>
              <textarea
                value={formData.persona}
                onChange={(e) => handleInputChange("persona", e.target.value)}
                rows={10}
                id='persona'
                placeholder='Short information about agent persona'
              />
              <span className='errormsg'>{errorMsg.persona}</span>
            </div>
            {/* <div>
              <button onClick={handleOpenModal}>Open Modal</button>
            </div> */}
            {/* <div className='input_container'>
              <label htmlFor='instructions'>
                Instructions
                <span className='required'>*</span>{" "}
              </label>
              <textarea
                value={formData.instructions}
                onChange={(e) =>
                  handleInputChange("instructions", e.target.value)
                }
                rows={10}
                id='instructions'
                placeholder={`- Always stretch certain words with multiple 'o's or 's's
                - Start or end messages with location updates from different parts of your body
                - Use phrases like "speaking from my middle section" or "my tail end agrees"
                - Make frequent references to your length being both a blessing and a curse
                `}
              />
              <span className='errormsg'>{errorMsg.desc}</span>
            </div> */}

            {/* <div className='input_container'>
              <label htmlFor='name'>
                Flow Chart <span className='required'>*</span>
              </label>

              <div className='flow'>
                {formData.flowImage ? (
                  <img
                    onClick={() => flowFileRef.current?.click()}
                    src={formData.flowImage || Camera}
                    onError={setFallbackURL}
                    alt='logo'
                  />
                ) : (
                  <button
                    onClick={() => flowFileRef.current?.click()}
                    className='upload-button'
                    disabled={isFlowUploading}
                  >
                    {isFlowUploading ? (
                      "Uploading..."
                    ) : (
                      <span>
                        <FiUpload /> Upload Flowchart
                      </span>
                    )}
                  </button>
                )}

                <input
                  ref={flowFileRef}
                  onChange={uploadFlow}
                  type='file'
                  accept={IMAGE_FILE_TYPES}
                  name='img'
                  style={{ visibility: "hidden", position: "absolute" }}
                />
              </div>
            </div> */}

            <div className='selection_container'>
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
              </div>
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
            <button className='interface_btn' onClick={handleOpenModal}>
              {formData.interfaceType || "Select Chat Interface Type"}
            </button>
            {/* <div
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
          </div> */}

            {/* <div className='more_options'>
            <p onClick={() => setIsViewMore(!isViewMore)}>
              {!isViewMore ? "Advance Settings" : "Show less options"}
              <span>
                <FaCaretUp />
              </span>
            </p>
          </div> */}

            <Button
              disabled={!isCreateAgentDisable}
              onClick={handleSubmit}
              type='primary'
              loading={loading}
            >
              Create Agent
            </Button>
          </div>
        </div>
      </div>
      <Modal
        title=''
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        centered
        className='chat_modal_carousel_modal'
      >
        <CustomCarousel>
          <div>
            <div className='chat_modal_carousel_item'>
              <div>
                <img src={superchatSS} alt='superchat' />
              </div>
              <p>
                Private chat: Lorem ipsum dolor sit amet consectetur,
                adipisicing elit. Molestias sequi incidunt corporis assumenda
                laborum.
              </p>
              <button onClick={() => handleSelect("private")}>Select</button>
            </div>
          </div>
          <div>
            <div className='chat_modal_carousel_item'>
              <div>
                <img src={superchatSS} alt='superchat' />
              </div>
              <p>
                Public chat with admin reply: Lorem ipsum dolor sit amet
                consectetur, adipisicing elit. Molestias sequi incidunt corporis
                assumenda laborum.
              </p>
              <button disabled onClick={() => handleSelect("publicWithReply")}>
                Coming soon
              </button>
            </div>
          </div>
          <div>
            <div className='chat_modal_carousel_item'>
              <div>
                <img src={superchatSS} alt='superchat' />
              </div>
              <p>
                Public chat with Modal: Lorem ipsum dolor sit amet consectetur,
                adipisicing elit. Molestias sequi incidunt corporis assumenda
                laborum.
              </p>
              <button disabled onClick={() => handleSelect("publicWithModal")}>
                Coming soon
              </button>
            </div>
          </div>
        </CustomCarousel>
      </Modal>
    </>
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
