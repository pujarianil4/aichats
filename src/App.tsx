import "./App.css";
import "./styles/index.scss";
import AiChats from "./components/aichat/index.js";
import Navbar from "./components/navbar/index.tsx";
import useOnlineStatus from "./hooks/useOnlineStatus.js";

function App() {
  const isOnline = useOnlineStatus();
  return (
    <>
      <Navbar />
      <AiChats
        youtubeLink='https://www.youtube.com/embed/1mwjOdC4Si8'
        address=''
      />
    </>
  );
}

export default App;
