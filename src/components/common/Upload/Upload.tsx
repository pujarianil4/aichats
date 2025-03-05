import React, { useState } from "react";
import { InboxOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import { message, Upload } from "antd";
import { useParams } from "react-router-dom";
import { getTokens } from "../../../services/apiconfig.ts";

const { Dragger } = Upload;

interface IProps {
  onSuccess: () => void;
}

const CustomUpload = ({ onSuccess }: IProps) => {
  const [fileList, setFileList] = useState<any[]>([]);
  const { agentId } = useParams();
  const cookies = getTokens();
  const props: UploadProps = {
    name: "file",
    multiple: false,
    maxCount: 1,
    action: `https://ai-agent-r139.onrender.com/upload/kb/file/${agentId}`,
    headers: {
      Authorization: `Bearer ${cookies.token}`, // Example token
    },
    accept: ".pdf",
    fileList, // Controlled file list
    defaultFileList: [
      {
        uid: "1",
        name: "xxx.png",
        status: "uploading",
        url: "http://www.baidu.com/xxx.png",
        percent: 33,
      },
    ],

    onChange(info) {
      const { status } = info.file;
      console.log("Status", status);
      setFileList(info.fileList);
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
        // Clear file list after upload
        onSuccess();
        setFileList([]);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    beforeUpload(file) {
      if (fileList.length > 0) {
        message.error("You can only upload one file at a time.");
        return Upload.LIST_IGNORE; // Ignore additional file selection
      }
      return true;
    },
    onRemove() {
      setFileList([]);
    },
  };

  const handleChange = (info: any) => {};

  return (
    <Dragger {...props}>
      <p className='ant-upload-drag-icon'>
        <InboxOutlined />
      </p>
      <p className='ant-upload-text'>
        Click or drag file to this area to upload
      </p>
      <p className='ant-upload-text'>
        Only files with the following formats are allowed: PDF.
      </p>
    </Dragger>
  );
};

export default CustomUpload;
