import { useEffect, useRef, useState } from "react";
import {
  ConnectButton,
  useConnectModal,
  useChainModal,
} from "@rainbow-me/rainbowkit";
import { Button, message, Modal } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useAccount, useSignMessage, useDisconnect } from "wagmi";
import LammaLogo from "./../../assets/logo.png";
import {
  handleAuthConnect,
  handleAuthDisconnect,
} from "../../services/auth.ts";
import { authSignMsg } from "../../utils/contants.ts";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks.tsx";
import { shortenAddress } from "../../utils/index.ts";
import { setUserError } from "../../contexts/reducers/index.ts";
import { RxHamburgerMenu } from "react-icons/rx";
import { clearTokens, getTokens } from "../../services/apiconfig.ts";
import CPopup from "../common/CPopup/Cpopup.tsx";
import { IoSearch } from "react-icons/io5";
import "./index.scss";

function Navbar() {
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { disconnect } = useDisconnect();
  const { openChainModal } = useChainModal();
  const { openConnectModal } = useConnectModal();
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  const { isLoading, profile, error } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const cookies = getTokens();

  const navLinks = [
    { href: "/", label: "Sentient" },
    { href: "#", label: "Prototype" },
    { href: "#", label: "About" },
  ];

  // Handle wallet connection and message signing
  const handleWalletConnect = async () => {
    if (!isConnected) {
      openConnectModal?.();
    } else if (isConnected && !cookies.token) {
      try {
        // Request message signing
        const signature = await signMessageAsync({ message: authSignMsg });
        console.log("Signature:", signature);

        // Authenticate user with the signature
        await handleAuthConnect({
          sig: signature,
          msg: authSignMsg,
          typ: "EVM",
        });
        message.success("Authentication successful!");
      } catch (error) {
        console.error("Error during signing:", error);
        message.error("Failed to sign message. Please try again.");
        disconnect();
      }
    }
  };

  // Handle user disconnect
  const handleDisconnect = async () => {
    try {
      await handleAuthDisconnect();
      dispatch(setUserError("Disconnected"));
      disconnect();
      clearTokens();
      message.success("Disconnected successfully!");
      navigate("/");
      setTimeout(() => {
        window?.location?.reload();
      }, 1000);
    } catch (error) {
      console.error("Error during disconnect:", error);
      message.error("Failed to disconnect. Please try again.");
    }
  };

  useEffect(() => {
    if (isConnected) {
      handleWalletConnect();
    }
  }, [isConnected]);

  // Handle token expiry
  useEffect(() => {
    if (isConnected && error.includes("expired") && cookies.token) {
      message.error("Session Expired, Please Login Again!");
      navigate("/");
      disconnect();
      clearTokens();
      dispatch(setUserError("")); // Reset the error state
    }
  }, [isConnected, error, cookies.token]);

  // Handle menu actions
  const defaultMenuActions: Record<
    string,
    { action: () => void; className?: string }
  > = {
    Sentient: { action: () => navigate("/sentient"), className: "mobile_hide" },
    Prototype: {
      action: () => navigate("/prototype"),
      className: "mobile_hide",
    },
    About: { action: () => navigate("/about"), className: "mobile_hide" },
  };

  const connectedMenuActions: Record<
    string,
    { action: () => void; className?: string }
  > = {
    "My Agents": { action: () => navigate("/myagent") },
    "Create New Agent": { action: () => setOpenModal(true) },
  };

  const menuActions =
    isConnected && cookies.token
      ? { ...connectedMenuActions, ...defaultMenuActions }
      : defaultMenuActions;

  const handleMenuSelect = (label: string) => {
    const menuItem = menuActions[label];
    if (menuItem && menuItem.action) {
      menuItem.action();
    }
  };

  return (
    <>
      <div className='navbar'>
        <div className='container'>
          <div className='content'>
            <div>
              <a href='/' className='logo'>
                <img src={LammaLogo} alt='logo' />
              </a>
            </div>

            <div className='nav'>
              {navLinks.map((link) => (
                <a key={link.label} href={link.href} className='link'>
                  {link.label}
                </a>
              ))}
            </div>

            <div className='search'>
              <IoSearch className='search-icon' size={22} />
              <input
                ref={searchRef}
                type='text'
                className='search-input'
                placeholder='Search...'
              />
            </div>

            <div className='actions'>
              {isConnected && cookies.token && (
                <a href='/myagent'>
                  <Button className='hidebtn myagent_btn'>My Agents</Button>
                </a>
              )}
              <Button className='hidebtn' onClick={() => setOpenModal(true)}>
                Create New Agent
              </Button>
              {isConnected && cookies.token ? (
                <CPopup
                  onSelect={(label) => {
                    if (label === "Disconnect") handleDisconnect();
                    if (label === "Switch Network") openChainModal?.();
                    if (label === "Profile") navigate("/profile");
                  }}
                  onAction='click'
                  position='bottomRight'
                  list={[
                    { label: "Profile" },
                    { label: "Disconnect" },
                    { label: "Switch Network" },
                  ]}
                >
                  <Button type='primary' className='address'>
                    {address && shortenAddress(address)}
                  </Button>
                </CPopup>
              ) : (
                <Button onClick={handleWalletConnect} type='primary'>
                  Connect Wallet
                </Button>
              )}
            </div>

            <div className='mobile'>
              <CPopup
                onSelect={handleMenuSelect}
                onAction='click'
                position='bottomRight'
                list={Object.entries(menuActions).map(
                  ([label, { className }]) => ({
                    label,
                    class: className,
                  })
                )}
              >
                <div className='other'>
                  <RxHamburgerMenu color='#ff00b7' size={24} />
                </div>
              </CPopup>
            </div>
          </div>
        </div>
      </div>

      <Modal
        open={openModal}
        title='Create New AI Agent'
        onOk={() => setOpenModal(false)}
        onCancel={() => setOpenModal(false)}
        footer={null}
      >
        <div className='modal_content'>
          <div className='manual'>
            <h3>Manual Build</h3>
            <p>
              Manually input parameters Build your own agent and tailor every
              detail
            </p>
            <Link onClick={() => setOpenModal(false)} to='/create-agent'>
              <button>Create AI Agent</button>
            </Link>
          </div>
          <div className='magic'>
            <h3>Magic Build</h3>
            <p>
              Enter the token's contract address We will design the most
              suitable agent for you
            </p>
            <Link onClick={() => setOpenModal(false)} to='/magic-build'>
              <button>Create AI Agent</button>
            </Link>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default Navbar;
