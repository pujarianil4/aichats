import "./App.scss";
import "./styles/index.scss";

import AppRoutes from "./routes/Router.tsx";

function App() {
  return (
    <main className='dark'>
      <AppRoutes />
    </main>
  );
}

export default App;
