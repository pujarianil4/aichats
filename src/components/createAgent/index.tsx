import React, { useEffect, useRef, useState } from "react";
import "./index.scss";
import { Button, Select, Popover } from "antd";
import type { TabsProps } from "antd";
import { FaCaretUp, FaChevronDown } from "react-icons/fa";
import { BsDashCircle } from "react-icons/bs";
import Camera from "../../assets/camera.png";
import { GoArrowSwitch } from "react-icons/go";
import CustomTabs from "../common/Tabs/Tabs.tsx";
import { useImageNameValidator } from "../../hooks/useImageNameValidator.tsx";
import { createAgent, uploadSingleFile } from "../../services/api.ts";
import { isAddress } from "viem";
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
  personality: string;
  agentType: string;
  // greeting: string;
  // environmentPrompts: EnvironmentPrompts;
  // sampleConversations: IConversation[];
};

export default function CreateAgent() {
  const [isViewMore, setIsViewMore] = useState(false);
  const [tabs, setTabs] = useState("new");
  const { validateImage, error: err, clearError } = useImageNameValidator();
  const [sampleConversations, setSampleConversation] = useState<
    Array<IConversation>
  >([]);
  const [errorMsg, setErrorMsg] = useState({
    desc: "",
    contractAddress: "",
    personality: "",
  });
  const fileRefs = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    ticker: "",
    profile: "",
    contractAddress: "",
    desc: "",
    instructions: "",
    personality: "",
    agentType: "none",
    // greeting: "",
    // environmentPrompts: {
    //   forum: { prefix: "", suffix: "" },
    //   twitter: { prefix: "", suffix: "" },
    //   telegram: { prefix: "", suffix: "" },
    //   livestream: { prefix: "", suffix: "" },
    // },
    // sampleConversations: [],
  });

  const isCreateAgentDisable =
    formData.name &&
    formData.desc &&
    formData.profile &&
    formData.ticker &&
    formData.contractAddress &&
    formData.instructions &&
    formData.personality;
  // (tabs == "new" ? formData.ticker : formData.contractAddress);
  const setFallbackURL = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.log("error", e);

    e.currentTarget.src = Camera;
  };
  const handleInputChange = (key: string, value: string) => {
    if (key == "instructions") {
      const formattedValue = enforceBulletFormat(value);
      setFormData((prev) => ({
        ...prev,
        [key]: formattedValue,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [key]: value,
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

      //setImgSrc(imgURL);
    }
  };

  const formValidation = () => {
    const { desc, contractAddress, instructions, personality } = formData;

    const validations = [
      {
        condition: () => {
          const charLength = String(desc).split(" ").join("").length;
          return charLength >= 150 && charLength <= 500;
        },
        field: "desc",
        errorMsg:
          "Description must be between 150 and 500 characters (excluding spaces).",
      },
      {
        condition: () => {
          const charLength = String(personality).split(" ").join("").length;
          return charLength >= 150 && charLength <= 500; // Example validation range
        },
        field: "personality",
        errorMsg:
          "Personality must be between 150 and 500 characters (excluding spaces).",
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

    if (formValidation()) {
      const data = {
        name: formData.name,
        pic: formData.profile,
        token: {
          tkr: formData.ticker,
          tCAddress: formData.contractAddress,
        },
        desc: formData.desc,
        personality: formData.personality,
        instructions: formData.instructions
          .split("\n")
          .map((line) => line.replace(/^-\s*/, "").trim()),
        typ: formData.agentType,
      };
      console.log("Form Data Submitted:", data);
      // const res = await createAgent(data);
    }

    // Handle form submission logic, like sending to an API.
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
    return formattedLines.join("\n");
  };
  // const items: TabsProps["items"] = [
  //   {
  //     key: "1",
  //     label: "Forum Prompt",
  //     children: (
  //       <div className='tab_content'>
  //         <div className='area'>
  //           <label htmlFor='name'>Environment Prompt Prefix</label>
  //           <textarea
  //             rows={5}
  //             value={formData.environmentPrompts["forum"].prefix}
  //             onChange={(e) =>
  //               handleEnvironmentPromptChange("forum", "prefix", e.target.value)
  //             }
  //             id='bio'
  //             placeholder='This is the short bio that will be shown at your agents profile.'
  //           />
  //         </div>

  //         <div className='divider'></div>
  //         <div className='area'>
  //           <label htmlFor='name'>Environment Prompt Suffix</label>
  //           <textarea
  //             rows={5}
  //             value={formData.environmentPrompts["forum"].suffix}
  //             onChange={(e) =>
  //               handleEnvironmentPromptChange("forum", "suffix", e.target.value)
  //             }
  //             id='bio'
  //             placeholder='This is the short bio that will be shown at your agents profile.'
  //           />
  //         </div>
  //       </div>
  //     ),
  //   },
  //   {
  //     key: "2",
  //     label: "X(twitter) Prompt",
  //     children: (
  //       <div className='tab_content'>
  //         <div className='area'>
  //           <label htmlFor='name'>Environment Prompt Prefix</label>
  //           <textarea
  //             rows={5}
  //             value={formData.environmentPrompts["twitter"].prefix}
  //             onChange={(e) =>
  //               handleEnvironmentPromptChange(
  //                 "twitter",
  //                 "prefix",
  //                 e.target.value
  //               )
  //             }
  //             id='bio'
  //             placeholder='This is the short bio that will be shown at your agents profile.'
  //           />
  //         </div>

  //         <div className='divider'></div>
  //         <div className='area'>
  //           <label htmlFor='name'>Environment Prompt Suffix</label>
  //           <textarea
  //             rows={5}
  //             id='bio'
  //             value={formData.environmentPrompts["twitter"].suffix}
  //             onChange={(e) =>
  //               handleEnvironmentPromptChange(
  //                 "twitter",
  //                 "suffix",
  //                 e.target.value
  //               )
  //             }
  //             placeholder='This is the short bio that will be shown at your agents profile.'
  //           />
  //         </div>
  //       </div>
  //     ),
  //   },
  //   {
  //     key: "3",
  //     label: "Telegram Prompt",
  //     children: (
  //       <div className='tab_content'>
  //         <div className='area'>
  //           <label htmlFor='name'>Environment Prompt Prefix</label>
  //           <textarea
  //             rows={5}
  //             value={formData.environmentPrompts["telegram"].prefix}
  //             onChange={(e) =>
  //               handleEnvironmentPromptChange(
  //                 "telegram",
  //                 "prefix",
  //                 e.target.value
  //               )
  //             }
  //             id='bio'
  //             placeholder='This is the short bio that will be shown at your agents profile.'
  //           />
  //         </div>

  //         <div className='divider'></div>
  //         <div className='area'>
  //           <label htmlFor='name'>Environment Prompt Suffix</label>
  //           <textarea
  //             rows={5}
  //             value={formData.environmentPrompts["telegram"].suffix}
  //             onChange={(e) =>
  //               handleEnvironmentPromptChange(
  //                 "telegram",
  //                 "suffix",
  //                 e.target.value
  //               )
  //             }
  //             id='bio'
  //             placeholder='This is the short bio that will be shown at your agents profile.'
  //           />
  //         </div>
  //       </div>
  //     ),
  //   },
  //   {
  //     key: "4",
  //     label: "Livestream Prompt",
  //     children: (
  //       <div className='tab_content'>
  //         <div className='area'>
  //           <label htmlFor='name'>Environment Prompt Prefix</label>
  //           <textarea
  //             rows={5}
  //             value={formData.environmentPrompts["livestream"].prefix}
  //             onChange={(e) =>
  //               handleEnvironmentPromptChange(
  //                 "livestream",
  //                 "prefix",
  //                 e.target.value
  //               )
  //             }
  //             id='bio'
  //             placeholder='This is the short bio that will be shown at your agents profile.'
  //           />
  //         </div>

  //         <div className='divider'></div>
  //         <div className='area'>
  //           <label htmlFor='name'>Environment Prompt Suffix</label>
  //           <textarea
  //             rows={5}
  //             value={formData.environmentPrompts["livestream"].suffix}
  //             onChange={(e) =>
  //               handleEnvironmentPromptChange(
  //                 "livestream",
  //                 "suffix",
  //                 e.target.value
  //               )
  //             }
  //             id='bio'
  //             placeholder='This is the short bio that will be shown at your agents profile.'
  //           />
  //         </div>
  //       </div>
  //     ),
  //   },
  // ];

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
              Personality
              <span className='required'>*</span>{" "}
            </label>
            <textarea
              value={formData.personality}
              onChange={(e) => handleInputChange("personality", e.target.value)}
              rows={10}
              id='personality'
              placeholder='Short information about agent personality'
            />
            <span className='errormsg'>{errorMsg.desc}</span>
          </div>
          <div className='input_container'>
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
- Include spatial references like "while my head is in Miami, my tail is still in New York"
- Use elongated emojis when possible: 🌭 🐍 📏 
- Occasionally mention the challenges of being so long (taking forever to turn corners, getting tangled in crypto charts)
- Speaking style example: "Loooooong time no seeeee! My front end is bullish on $LOG while my back end is still reading yesterday's charts! That's the greeeeat thing about being this long - I can monitor multiple exchanges at onccccce! 🌭"`}
            />
            <span className='errormsg'>{errorMsg.desc}</span>
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
            // disabled={!isCreateAgentDisable}
            onClick={handleSubmit}
            type='primary'
          >
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
