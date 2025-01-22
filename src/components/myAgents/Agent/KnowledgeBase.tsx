import React, { useState } from "react";
import "./knowledgebase.scss";
import { CgWebsite } from "react-icons/cg";
import { IoIosGlobe } from "react-icons/io";
import { RxText } from "react-icons/rx";
import { IoDocumentTextOutline } from "react-icons/io5";
import { IoIosSearch } from "react-icons/io";
import { BsTable } from "react-icons/bs";
import { MdOutlineUploadFile } from "react-icons/md";

import { Checkbox } from "antd";
import type { CheckboxProps } from "antd";

const kbData = [
  {
    id: 1,
    type: "richtext",
    data: "Text",
  },
  {
    id: 2,
    type: "website",
    data: "Text",
  },
  {
    id: 3,
    type: "documents",
    data: "Text",
  },
];

interface IKBData {
  id: number;
  type: string;
  data: any;
}

const icons: any = {
  richtext: <RxText size={25} />,
  website: <IoIosGlobe size={25} />,
  table: <BsTable size={25} />,
  documents: <IoDocumentTextOutline size={25} />,
  search: <IoIosSearch size={25} />,
  upload: <MdOutlineUploadFile size={25} />,
};

export default function KnowledgeBase() {
  const [checkedList, setCheckedList] = useState<number[]>([]);

  const checkAll = kbData.length === checkedList.length;
  const indeterminate =
    checkedList.length > 0 && checkedList.length < kbData.length;

  const onCheckChange = (id: number) => {
    if (checkedList.includes(id)) {
      setCheckedList(checkedList.filter((item) => item !== id));
    } else {
      setCheckedList([...checkedList, id]);
    }
  };

  const onCheckAllChange: CheckboxProps["onChange"] = (e) => {
    setCheckedList(e.target.checked ? kbData.map((d) => d.id) : []);
  };

  return (
    <div className='kb_container'>
      <div className='kb_header'>
        <div>
          <Checkbox
            indeterminate={indeterminate}
            onChange={onCheckAllChange}
            checked={checkAll}
          />
        </div>
        {indeterminate || checkAll ? (
          <div className='item'>
            <p>Remove Selected</p>
          </div>
        ) : (
          <>
            <div className='item'>
              <IoIosGlobe size={18} />
              <p>Website</p>
            </div>
            <div className='item'>
              <BsTable size={18} />
              <p>Table</p>
            </div>
            <div className='item'>
              <RxText size={18} />
              <p>Rich Text</p>
            </div>
            <div className='item'>
              <IoDocumentTextOutline size={18} />
              <p>Documents</p>
            </div>
            <div className='item'>
              <IoIosSearch size={18} />
              <p>Web Search</p>
            </div>
            <div className='item'>
              <MdOutlineUploadFile size={18} />
              <p>Upload From Api</p>
            </div>
          </>
        )}
      </div>
      <div className='kb_body'>
        {kbData.map((item) => (
          <KBList
            key={item.id}
            item={item}
            checkedList={checkedList}
            onCheckChange={onCheckChange}
          />
        ))}
      </div>
    </div>
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
  const handleCheck = () => {
    onCheckChange(item.id);
  };

  return (
    <div className='kb_list'>
      <div>
        <Checkbox
          onChange={handleCheck}
          checked={checkedList.includes(item.id)}
        />
      </div>
      <div className='item'>
        <div className='icon'>{icons[item.type]}</div>
        <div className='content'>
          <p>{item.type}</p>
          <span>Created 6 hours ago</span>
        </div>
      </div>
    </div>
  );
};
