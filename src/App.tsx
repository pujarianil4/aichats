import "./App.scss";
import "./styles/index.scss";
import useOnlineStatus from "./hooks/useOnlineStatus.js";
import AppRoutes from "./routes/Router.tsx";

function App() {
  const isOnline = useOnlineStatus();

  return (
    <main className='dark'>
      <AppRoutes />
    </main>
  );
}

export default App;
