// import React from "react";
// import "./chatinput.scss";
// export default function ChatInput() {
//   return (
//     <div className='chatinputContainer'>
//       <div className='inputs'>
//         <input
//           type='text'
//           className='input_text'
//           placeholder='Type Something..'
//         />
//         <button>Send</button>
//       </div>
//     </div>
//   );
// }

import React, { useState } from "react";
import "./chatinput.scss";
import socket from "../../../services/socket.ts";

export default function ChatInput() {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim() !== "") {
      socket.emit("chatMessage", {
        message,
        timestamp: new Date().toISOString(),
      });
      setMessage(""); // Clear the input field
    }
  };

  return (
    <div className='chatinputContainer'>
      <div className='inputs'>
        <input
          type='text'
          className='input_text'
          placeholder='Type Something..'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSend()} // Send on Enter
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}
