// import { useEffect, useRef, useState } from "react";
// import "./index.scss";
// import Agent from "./Agent.tsx";
// import Emulator from "./Emulator.tsx";

// export default function AgentHome() {
//   const [isEmulatorOpen, setIsEmulatorOpen] = useState(true);
//   const [agentWidth, setAgentWidth] = useState(65);
//   const [emulatorWidth, setEmulatorWidth] = useState(35);

//   const dividerRef = useRef<HTMLDivElement>(null);

//   const toggleEmulator = () => {
//     setIsEmulatorOpen((prev) => !prev);
//   };

//   const handleMouseDown = (e: React.MouseEvent) => {
//     e.preventDefault();

//     const startX = e.clientX;
//     const startAgentWidth = agentWidth;
//     const startEmulatorWidth = emulatorWidth;

//     const handleMouseMove = (event: MouseEvent) => {
//       const deltaX = event.clientX - startX;
//       const newAgentWidth = Math.max(
//         40,
//         Math.min(80, startAgentWidth + (deltaX / window.innerWidth) * 100)
//       );
//       const newEmulatorWidth = Math.max(
//         20,
//         Math.min(60, startEmulatorWidth - (deltaX / window.innerWidth) * 100)
//       );

//       setAgentWidth(newAgentWidth);
//       setEmulatorWidth(newEmulatorWidth);
//     };

//     const handleMouseUp = () => {
//       document.removeEventListener("mousemove", handleMouseMove);
//       document.removeEventListener("mouseup", handleMouseUp);
//     };

//     document.addEventListener("mousemove", handleMouseMove);
//     document.addEventListener("mouseup", handleMouseUp);
//   };

//   return (
//     <div className={`agenthome ${isEmulatorOpen ? "emulator-open" : ""}`}>
//       <div className='agent' style={{ width: `${agentWidth}%` }}>
//         <Agent
//           isEmulatorOpen={isEmulatorOpen}
//           toggleEmulator={toggleEmulator}
//         />
//       </div>

//       {isEmulatorOpen && (
//         <>
//           <div
//             className='divider'
//             ref={dividerRef}
//             onMouseDown={handleMouseDown}
//           />
//           <div className='emulator' style={{ width: `${emulatorWidth}%` }}>
//             <Emulator toggleEmulator={toggleEmulator} />
//           </div>
//         </>
//       )}
//     </div>
//   );
// }

import { useState } from "react";
import Agent from "./Agent.tsx";
import Emulator from "./Emulator.tsx";
import "./index.scss";
import { getMyAgentData } from "../../../services/agent.ts";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import PageLoader from "../../common/PageLoader.tsx";
import Emulatorr from "./Emulatorr.tsx";

export default function AgentHome() {
  const { agentId } = useParams();
  const agent = useQuery({
    queryKey: ["privateagent", agentId],
    queryFn: () => getMyAgentData(agentId!),
    enabled: !!agentId,
  });
  const [isEmulatorOpen, setIsEmulatorOpen] = useState(false);
  const toggleEmulator = (bool?: boolean) => {
    if (typeof bool === "boolean") {
      setIsEmulatorOpen(bool);
    } else {
      setIsEmulatorOpen((prev) => !prev);
    }
  };

  if (agent.isLoading) {
    return <PageLoader />;
  }

  return (
    <div className={`agenthome ${isEmulatorOpen ? "emulator-open" : ""}`}>
      <div className='agent'>
        <Agent
          isEmulatorOpen={isEmulatorOpen}
          toggleEmulator={toggleEmulator}
          agent={{ ...agent, id: agentId }}
        />
      </div>

      {isEmulatorOpen && (
        <div className='emulator'>
          {/* <Emulator toggleEmulator={toggleEmulator} /> */}
          <Emulatorr
            isEmulatorOpen={isEmulatorOpen}
            toggleEmulator={toggleEmulator}
            agentInfo={agent.data}
          />
        </div>
      )}
    </div>
  );
}
