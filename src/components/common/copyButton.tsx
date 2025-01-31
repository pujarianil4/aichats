import React, { useState } from "react";
import { FaCopy, FaCheck } from "react-icons/fa";

interface CopyButtonProps {
  text: string;
  className?: string;
}

const CopyButton: React.FC<CopyButtonProps> = ({ text, className }) => {
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy text:", error);
    }
  };

  return (
    <span onClick={handleCopy} className={className} title='Copy'>
      {copied ? <FaCheck color='white' /> : <FaCopy />}
    </span>
  );
};

export default CopyButton;
