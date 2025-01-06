import { ConnectButton } from "@rainbow-me/rainbowkit";
import "./index.scss";
function Navbar() {
  return (
    <div className='navbar_container'>
      <div>Super chat</div>
      <div>
        <ConnectButton />
      </div>
    </div>
  );
}

export default Navbar;
