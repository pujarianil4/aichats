import "./App.css";
import "./styles/index.scss";
import AiChats from "./components/aichat/index.js";
import Navbar from "./components/navbar/index.tsx";
import useOnlineStatus from "./hooks/useOnlineStatus.js";
import TradingViewChart from "./components/Charts/TradingViewChart.tsx";
import DextoolsWidget from "./components/Charts/Dex.tsx";
import GeckoChart from "./components/Charts/GeckoChart.tsx";
import { TokenDetails } from "./components/tokenDeatils/index.tsx";
import AgentList from "./components/AgentList/index.tsx";

function App() {
  const isOnline = useOnlineStatus();
  return (
    <div>
      <Navbar />
      {/* <TokenDetails /> */}
      <AgentList />
    </div>
  );
}

export default App;
