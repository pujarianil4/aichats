import { ConnectButton } from "@rainbow-me/rainbowkit";
import "./index.scss";
import { useAccount } from "wagmi";
import { useEffect, useRef } from "react";
import { connectAddress } from "../../services/api.ts";
function Navbar() {
  const { address, isConnected } = useAccount();
  const wasConnected = useRef(false);

  useEffect(() => {
    if (!wasConnected.current && isConnected) {
      handleWalletConnected(address!);
    }
    wasConnected.current = isConnected;
  }, [isConnected, address]);

  const handleWalletConnected = async (connectedAddress: string) => {
    console.log("Wallet connected with address:", connectedAddress);
    // await connectAddress("0xD5b26AC46d2F43F4d82889f4C7BBc975564859e3");
  };

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
