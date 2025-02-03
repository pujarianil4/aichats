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

export default function AgentHome() {
  const [isEmulatorOpen, setIsEmulatorOpen] = useState(false);

  const toggleEmulator = () => {
    setIsEmulatorOpen((prev) => !prev);
  };

  return (
    <div className={`agenthome ${isEmulatorOpen ? "emulator-open" : ""}`}>
      <div className='agent'>
        <Agent
          isEmulatorOpen={isEmulatorOpen}
          toggleEmulator={toggleEmulator}
        />
      </div>

      {isEmulatorOpen && (
        <div className='emulator'>
          <Emulator toggleEmulator={toggleEmulator} />
        </div>
      )}
    </div>
  );
}
