import { useState } from "react";

import "./App.css";
import AiChats from "./components/aichat/index.js";
import useOnlineStatus from "./hooks/useOnlineStatus.js";

function App() {
  const isOnline = useOnlineStatus();
  return (
    <>
      <AiChats youtubeLink='' address='' />
    </>
  );
}

export default App;
