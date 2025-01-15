import { useState } from "react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { IoCloseCircleSharp } from "react-icons/io5";
import { BsEmojiSmile } from "react-icons/bs";
import "./emojipicker.scss";
import { Popover } from "antd";
interface IEmojiPicker {
  setEmoji: (emoji: any) => void;
}

export default function EmojiPicker({ setEmoji }: IEmojiPicker) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(true);

  const addEmoji = (emoji: any) => {
    const text = emoji.native;
    setEmoji(text);
  };

  const content = (
    <div>
      <Picker theme='light' data={data} onEmojiSelect={addEmoji} />
    </div>
  );

  return (
    <div className='emoji_container'>
      <div>
        <Popover content={content} title='Title' trigger='click'>
          <BsEmojiSmile onClick={() => setShowEmojiPicker(true)} />
        </Popover>
      </div>
      {/* {showEmojiPicker && (
        <div className='emoji-picker'>
          <div
            onClick={() => setShowEmojiPicker(false)}
            className='close_picker'
          >
            {" "}
            <IoCloseCircleSharp size={25} />
          </div>

          <Picker theme='light' data={data} onEmojiSelect={addEmoji} />
        </div>
      )} */}
    </div>
  );
}
