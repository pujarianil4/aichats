import React from "react";
import Agent from "./Agent.tsx";
import "./index.scss";
import Emulator from "./Emulator.tsx";
export default function AgentHome() {
  return (
    <div className='agenthome'>
      <Agent />
      <Emulator />
    </div>
  );
}
