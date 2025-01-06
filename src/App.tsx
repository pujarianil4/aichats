import "./App.css";
import AiChats from "./components/aichat/index.js";
import useOnlineStatus from "./hooks/useOnlineStatus.js";

function App() {
  const isOnline = useOnlineStatus();
  return (
    <>

      <AiChats
        youtubeLink='https://www.youtube.com/embed/818MflVnP4I'
        address=''
      />
    </>
  );
}

export default App;
