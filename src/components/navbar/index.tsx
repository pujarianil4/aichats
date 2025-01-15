import { ConnectButton } from "@rainbow-me/rainbowkit";
import "./index.scss";
import { useAccount } from "wagmi";
import { useEffect, useRef } from "react";
import { connectAddress, getChatInstanceAdmin } from "../../services/api.ts";
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
      <div>Super chat</div>
      <div>
        <ConnectButton />
      </div>
    </div>
  );
}

export default Navbar;
