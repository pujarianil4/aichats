import "./App.css";
import AiChats from "./components/aichat/index.js";
import Navbar from "./components/navbar/index.tsx";
import useOnlineStatus from "./hooks/useOnlineStatus.js";

function App() {
  const isOnline = useOnlineStatus();
  return (
    <>
      <Navbar />
      <AiChats
        youtubeLink='https://www.youtube.com/embed/818MflVnP4I'
        address=''
      />
    </>
  );
}

export default App;
