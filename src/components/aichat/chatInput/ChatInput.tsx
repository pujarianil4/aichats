import React from "react";
import "./chatinput.scss";
export default function ChatInput() {
  return (
    <div className='chatinputContainer'>
      <div className='inputs'>
        <input
          type='text'
          className='input_text'
          placeholder='Type Something..'
        />
        <button>Send</button>
      </div>
    </div>
  );
}
