import { ConnectButton, useConnectModal } from "@rainbow-me/rainbowkit";
import "./index.scss";
import { Button } from "antd";
import { Link } from "react-router-dom";
import { useAccount } from "wagmi";
function Navbar() {
  const { address, isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  return (
    <div className='navbar_container'>
      <div className='navigation'>
        <a href='/'>
          {" "}
          <img src='./logo.png' alt='logo' />
        </a>
        <nav>
          <ul>
            <li>
              <a href='#'>Sentient</a>
            </li>
            <li>
              <a href='#'>Prototype</a>
            </li>
            <li>
              <a href='#'>About</a>
            </li>
          </ul>
        </nav>
      </div>
      <div className='search'>
        <input type='text' placeholder='Search' />
      </div>
      <div className='actions'>
        <Link to={"/create-agent"}>
          {" "}
          <Button> Create New Agent </Button>
        </Link>
        {isConnected ? (
          <ConnectButton />
        ) : (
          <Button onClick={openConnectModal} type='primary'>
            {" "}
            Connect Wallet
          </Button>
        )}
      </div>
    </div>
  );
}

export default Navbar;
