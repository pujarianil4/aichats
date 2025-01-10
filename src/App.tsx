import "./App.css";
import "./styles/index.scss";
import AiChats from "./components/aichat/index.js";
import Navbar from "./components/navbar/index.tsx";
import useOnlineStatus from "./hooks/useOnlineStatus.js";
import TradingViewChart from "./components/Charts/TradingViewChart.tsx";
import DextoolsWidget from "./components/Charts/Dex.tsx";
import GeckoChart from "./components/Charts/GeckoChart.tsx";

function App() {
  const isOnline = useOnlineStatus();
  return (
    <div>
      <Navbar />
      {/* <AiChats
        youtubeLink='https://www.youtube.com/embed/818MflVnP4I'
        address=''
      /> */}
      {/* <TradingViewChart /> */}
      {/* <DextoolsWidget /> */}
      <GeckoChart />
    </div>
  );
}

export default App;
