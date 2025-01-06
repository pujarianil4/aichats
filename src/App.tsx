import { useState } from "react";

import "./App.css";
import AiChats from "./components/aichat/index.js";
import Navbar from "./components/navbar/index.tsx";
function App() {
  return (
    <>
      <Navbar />
      <AiChats />
    </>
  );
}

export default App;
