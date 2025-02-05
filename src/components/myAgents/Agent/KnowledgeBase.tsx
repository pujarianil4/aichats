import React, { useEffect, useState } from "react";
import "./knowledgebase.scss";
import { CgWebsite } from "react-icons/cg";
import { IoIosGlobe } from "react-icons/io";
import { RxText } from "react-icons/rx";
import { IoDocumentTextOutline } from "react-icons/io5";
import { IoIosSearch } from "react-icons/io";
import { BsTable } from "react-icons/bs";
import { MdOutlineUploadFile } from "react-icons/md";

import { Button, Checkbox, message, Modal } from "antd";
import type { CheckboxProps } from "antd";
import CustomUpload from "../../common/Upload/Upload.tsx";
import {
  deleteKbByAgent,
  getKBbyAgentID,
  uploadTextByAgent,
} from "../../../services/agent.ts";
import { timeAgo } from "../../../utils/index.ts";
import { useQuery } from "@tanstack/react-query";

// const kbData = [
//   {
//     id: 1,
//     type: "richtext",
//     data: "Text",
//   },
//   {
//     id: 2,
//     type: "website",
//     data: "Text",
//   },
//   {
//     id: 3,
//     type: "documents",
//     data: "Text",
//   },
// ];

interface IKBData {
  id: number;
  aId: string;
  filename: string;
  content: string;
  typ: string;
  createdAt: string;
}

const icons: any = {
  text: <RxText size={25} />,
  website: <IoIosGlobe size={25} />,
  table: <BsTable size={25} />,
  file: <IoDocumentTextOutline size={25} />,
  search: <IoIosSearch size={25} />,
  upload: <MdOutlineUploadFile size={25} />,
};

export default function KnowledgeBase({ agentId }: { agentId: string }) {
  const [checkedList, setCheckedList] = useState<number[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [TabModalContent, setTabModalContent] = useState("website");
  // const [kbData, setKbData] = useState<IKBData[]>([]);
  const { data: kbData, refetch } = useQuery<IKBData[]>({
    queryKey: ["kbbyagent", agentId],
    queryFn: () => getKBbyAgentID(agentId!),
    enabled: !!agentId,
  });

  const showModal = (tab: string) => {
    setTabModalContent(tab);
    setOpenModal(true);
  };

  const handleOk = () => {
    setTimeout(() => {
      setOpenModal(false);
    }, 3000);
  };

  const handleCancel = () => {
    setOpenModal(false);
    refetch();
  };
  const checkAll = kbData?.length
    ? kbData?.length === checkedList.length
    : false;
  const indeterminate =
    kbData && checkedList.length > 0 && checkedList.length < kbData?.length;

  const onCheckChange = (id: number) => {
    if (checkedList.includes(id)) {
      setCheckedList(checkedList.filter((item) => item !== id));
    } else {
      setCheckedList([...checkedList, id]);
    }
  };

  const onCheckAllChange: CheckboxProps["onChange"] = (e) => {
    kbData && setCheckedList(e.target.checked ? kbData?.map((d) => d.id) : []);
  };

  const handleDeleteKb = async () => {
    try {
      const ids = checkedList;

      console.log("ids", ids);
      await deleteKbByAgent(agentId, {
        ids,
      });
      message.success("Delete Successfully !");
    } catch (error) {
      message.error("Failed to delete, please try again");
    }
  };

  const modalContent: any = {
    website: (
      <div className='add_website_modal'>
        <h2>Add A Website Source</h2>
        <p>
          Your chat bot will answer quetions from the content found on website
        </p>
        <div className='input_box'>
          <label htmlFor='website'>Website</label>
          <input type='text' id='website' placeholder='unilend.finance' />
        </div>
        <div className='btn'>
          <button>Save</button>
        </div>
      </div>
    ),
    documents: (
      <div className='add_doc_modal'>
        <h2>Add Documents</h2>

        <div className='input_box'>
          <CustomUpload onSuccess={() => handleCancel()} />
        </div>
        {/* <div className='btn'>
          <button>Save</button>
        </div> */}
      </div>
    ),
    table: (
      <div className='add_table_modal'>
        <h2>Add Table To Troubleshooting Guides</h2>
        <p>
          Give your chatbot the ability to search on your table data and
          generate meaningful answers to relevent quetions.
        </p>
        <div className='input_box'>
          <h3>Table Content</h3>
        </div>
        <div className='btn'>
          <button>Save</button>
        </div>
      </div>
    ),
    richText: (() => {
      const [richTextData, setRichTextData] = useState("");
      const [loading, setLoading] = useState(false);

      const handleSaveText = async () => {
        setLoading(true);
        try {
          await uploadTextByAgent(agentId, {
            content: richTextData,
          });
          handleCancel();
          message.success("Text uploaded Successfully !");
          console.log(richTextData);
        } catch (error) {
          message.error("Failed to Upload, Please Try Again");
        } finally {
          setLoading(false);
        }
      };
      return (
        <div className='add_richtext_modal'>
          <h2>Add Rich Text</h2>

          <div className='input_box'>
            <textarea
              rows={10}
              id='bio'
              value={richTextData}
              onChange={(e) => setRichTextData(e.target.value)}
              placeholder='This is the short bio that will be shown at your agents profile.'
            />
          </div>
          <div className='btn'>
            <Button
              className='secondary'
              loading={loading}
              onClick={handleSaveText}
            >
              Save
            </Button>
          </div>
        </div>
      );
    })(),
    webSearch: (
      <div className='add_richtext_modal'>
        <h2>Search the Web</h2>

        <div className='input_box'></div>
        <div className='btn'>
          <button>Save</button>
        </div>
      </div>
    ),
    uploadFromApi: (
      <div className='add_richtext_modal'>
        <h2>Add Rich Text</h2>

        <div className='input_box'>
          <h3>
            <textarea
              rows={10}
              id='bio'
              placeholder='This is the short bio that will be shown at your agents profile.'
            />
          </h3>
        </div>
        <div className='btn'>
          <button>Save</button>
        </div>
      </div>
    ),
  };

  return (
    <>
      <div className='kb_container'>
        <div className='kb_header'>
          <div>
            <Checkbox
              indeterminate={indeterminate}
              onChange={onCheckAllChange}
              checked={checkAll}
            />
          </div>
          {(indeterminate || checkAll) && kbData?.length ? (
            <div onClick={handleDeleteKb} className='item'>
              <p>Remove Selected</p>
            </div>
          ) : (
            <>
              <div onClick={() => showModal("website")} className='item'>
                <IoIosGlobe size={18} />
                <p>Website</p>
              </div>
              <div onClick={() => showModal("table")} className='item'>
                <BsTable size={18} />
                <p>Table</p>
              </div>
              <div onClick={() => showModal("richText")} className='item'>
                <RxText size={18} />
                <p>Rich Text</p>
              </div>
              <div onClick={() => showModal("documents")} className='item'>
                <IoDocumentTextOutline size={18} />
                <p>Documents</p>
              </div>
              <div onClick={() => showModal("webSearch")} className='item'>
                <IoIosSearch size={18} />
                <p>Web Search</p>
              </div>
              <div onClick={() => showModal("uploadFromApi")} className='item'>
                <MdOutlineUploadFile size={18} />
                <p>Upload From Api</p>
              </div>
            </>
          )}
        </div>
        <div className='kb_body'>
          {kbData?.map((item: any) => (
            <KBList
              key={item.id}
              item={item}
              checkedList={checkedList}
              onCheckChange={onCheckChange}
            />
          ))}
        </div>
      </div>
      <Modal
        open={openModal}
        className='kb_modal'
        rootClassName='kb_modal'
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        {modalContent[TabModalContent]}
      </Modal>
    </>
  );
}

const KBList = ({
  item,
  checkedList,
  onCheckChange,
}: {
  item: IKBData;
  checkedList: Array<number>;
  onCheckChange: (id: number) => void;
}) => {
  const [openModal, setOpenModal] = useState(false);
  const [TabModalContent, setTabModalContent] = useState("website");
  const handleCheck = () => {
    onCheckChange(item.id);
  };

  const showModal = (tab: string) => {
    setTabModalContent(tab);
    setOpenModal(true);
  };

  const handleOk = () => {
    setTimeout(() => {
      setOpenModal(false);
    }, 3000);
  };

  const handleCancel = () => {
    setOpenModal(false);
  };

  const modalContent: any = {
    website: (
      <div className='add_website_modal'>
        <h2>Add A Website Source</h2>
        <p>
          Your chat bot will answer quetions from the content found on website
        </p>
        <div className='input_box'>
          <label htmlFor='website'>Website</label>
          <input type='text' id='website' placeholder='unilend.finance' />
        </div>
        <div className='btn'>
          <button>Save</button>
        </div>
      </div>
    ),
    file: (
      <div className='show_doc_modal'>
        <div
          // dangerouslySetInnerHTML={{ __html: item.content }}
          className='doc'
        >
          {item.content.split("\n").map((line, index) =>
            line.trim() ? (
              <p key={index}>{line}</p>
            ) : (
              <br key={index} /> // For blank lines
            )
          )}
        </div>
      </div>
    ),
    table: (
      <div className='add_table_modal'>
        <h2>Add Table To Troubleshooting Guides</h2>
        <p>
          Give your chatbot the ability to search on your table data and
          generate meaningful answers to relevent quetions.
        </p>
        <div className='input_box'>
          <h3>Table Content</h3>
        </div>
        <div className='btn'>
          <button>Save</button>
        </div>
      </div>
    ),
    text: (
      <div className='add_richtext_modal'>
        <h2>Text</h2>

        <div className='input_box'>
          <textarea
            rows={10}
            id='bio'
            value={item.content}
            placeholder='This is the short bio that will be shown at your agents profile.'
          />
        </div>
        {/* <div className='btn'>
          <button>Save</button>
        </div> */}
      </div>
    ),
    webSearch: (
      <div className='add_richtext_modal'>
        <h2>Search the Web</h2>

        <div className='input_box'></div>
        <div className='btn'>
          <button>Save</button>
        </div>
      </div>
    ),
    uploadFromApi: (
      <div className='add_richtext_modal'>
        <h2>Add Rich Text</h2>

        <div className='input_box'>
          <h3>
            <textarea
              rows={10}
              id='bio'
              placeholder='This is the short bio that will be shown at your agents profile.'
            />
          </h3>
        </div>
        <div className='btn'>
          <button>Save</button>
        </div>
      </div>
    ),
  };

  return (
    <>
      <div className='kb_list'>
        <div>
          <Checkbox
            onChange={handleCheck}
            checked={checkedList.includes(item.id)}
          />
        </div>
        <div onClick={() => showModal(item.typ)} className='item'>
          <div className='icon'>{icons[item.typ]}</div>
          <div className='content'>
            <p>{item.filename}</p>
            <span>{timeAgo(item.createdAt)}</span>
          </div>
        </div>
      </div>
      <Modal
        open={openModal}
        className='kb_modal'
        rootClassName='kb_modal'
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        {modalContent[TabModalContent]}
      </Modal>
    </>
  );
};

// const WebSiteIcon = () => {
//   return (
//     <div className='item'>
//       <IoIosGlobe size={18} />
//       <p>Website</p>
//     </div>
//   );
// };
