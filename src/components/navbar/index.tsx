import { ConnectButton } from "@rainbow-me/rainbowkit";
import "./index.scss";
import { useAccount } from "wagmi";
import { useEffect, useRef } from "react";
import { connectAddress, getChatInstanceAdmin } from "../../services/api.ts";
import { Button } from "antd";
function Navbar() {
  const { address, isConnected } = useAccount();
  const wasConnected = useRef(false);
  const path = window.location.pathname;
  const param = path.split("/")[1];
  useEffect(() => {
    if (!wasConnected.current && isConnected) {
      handleWalletConnected(address!);
    }
    wasConnected.current = isConnected;
    if (!isConnected) {
      sessionStorage.setItem("isAdmin", "false");
    }
  }, [isConnected, address]);

  const handleWalletConnected = async (connectedAddress: string) => {
    console.log("Wallet connected with address:", connectedAddress);
    await connectAddress(connectedAddress, Number(param));

    const adminData = await getChatInstanceAdmin(+param);
    const isAdmin = adminData.adminAddress === connectedAddress;
    sessionStorage.setItem("isAdmin", JSON.stringify(isAdmin));
  };

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
        <Button> Create New Agent </Button>
        <Button type='primary'> Connect Wallet</Button>
      </div>
    </div>
  );
}

export default Navbar;
