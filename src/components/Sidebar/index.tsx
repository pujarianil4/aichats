import React, { useState, useEffect } from "react";
import "./index.scss";
import { Link, useNavigate, useLocation } from "react-router-dom";
import LammaLogo from "./../../assets/logo.png";
import { useConnectModal, useChainModal } from "@rainbow-me/rainbowkit";
import { Menu, Button, Modal, message } from "antd";
import { useAccount, useSignMessage, useDisconnect } from "wagmi";
import { FaHome, FaUser, FaGlobe, FaPlus } from "react-icons/fa";
import {
  handleAuthConnect,
  handleAuthDisconnect,
} from "../../services/auth.ts";
import { authSignMsg } from "../../utils/contants.ts";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks.tsx";
import { shortenAddress } from "../../utils/index.ts";
import { setUserError } from "../../contexts/reducers/index.ts";
import { clearTokens, getTokens } from "../../services/apiconfig.ts";
import CPopup from "../common/CPopup/Cpopup.tsx";
import { LuPanelLeftClose } from "react-icons/lu";

import { LuPanelRightClose } from "react-icons/lu";

export default function SidebarWithNavbar() {
  const [isCreateAgentModalOpen, setIsCreateAgentModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // State to toggle sidebar
  const navigate = useNavigate();
  const location = useLocation();
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { disconnect } = useDisconnect();
  const { openChainModal } = useChainModal();
  const { openConnectModal } = useConnectModal();
  const { isLoading, profile, error } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const cookies = getTokens();

  const pathname = location.pathname;
  const pathKey = pathname === "/" ? "home" : pathname.replace("/", "");

  const sidebarItems = [
    {
      key: "home",
      icon: <FaHome />,
      label: "Home",
    },
    {
      key: "create-agent",
      icon: <FaPlus />,
      label: "Create Agent",
    },
    {
      key: "exploreagent",
      icon: <FaGlobe />,
      label: "Explore Agents",
    },
    {
      key: "profile",
      icon: <FaUser />,
      label: "Profile",
    },
  ];

  const handleMenuClick = (e: any) => {
    if (e.key === "create-agent") {
      setIsCreateAgentModalOpen(true);
    } else {
      navigate(e.key === "home" ? "/" : `/${e.key}`);
    }
  };

  const handleWalletConnect = async () => {
    if (!isConnected) {
      openConnectModal?.();
    } else if (isConnected && !cookies.token) {
      try {
        const signature = await signMessageAsync({ message: authSignMsg });
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
    if (isConnected && error.includes("expired") && cookies.token) {
      message.error("Session Expired, Please Login Again!");
      navigate("/");
      disconnect();
      clearTokens();
      dispatch(setUserError(""));
    }
  }, [isConnected, error, cookies.token]);

  useEffect(() => {
    if (isConnected) {
      handleWalletConnect();
    }
  }, [isConnected]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <aside className={`sidebar ${isSidebarOpen ? "open" : "closed"}`}>
      {/* Logo */}
      <div className='sidebar-bx'>
        <div className='sidebar-logo'>
          <Link to='/'>
            <img src={LammaLogo} alt='logo' />
          </Link>{" "}
        </div>

        <div className='toggle-button'>
          <Button onClick={toggleSidebar} className='toggle-icon'>
            {isSidebarOpen ? <LuPanelLeftClose /> : <LuPanelRightClose />}
          </Button>
        </div>
      </div>

      {/* Toggle Button */}

      {/* Sidebar Menu */}
      <div className='sidebar-menu'>
        <Menu
          selectedKeys={[pathKey]}
          mode='inline'
          theme='dark'
          items={sidebarItems}
          onClick={handleMenuClick}
        />
      </div>

      {/* Wallet Button */}
      <div className='wallet_bx'>
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
              {isSidebarOpen ? address && shortenAddress(address) : <FaUser />}
            </Button>
          </CPopup>
        ) : (
          <Button onClick={handleWalletConnect} className='connect-wallet'>
            {isSidebarOpen ? "Connect Wallet" : <FaUser />}
          </Button>
        )}
      </div>

      {/* Create Agent Modal */}
      <Modal
        open={isCreateAgentModalOpen}
        title='Create New AI Agent'
        onOk={() => setIsCreateAgentModalOpen(false)}
        onCancel={() => setIsCreateAgentModalOpen(false)}
        footer={null}
      >
        <div className='modal_content'>
          <div className='manual'>
            <h3>Manual Build</h3>
            <p>
              Manually input parameters Build your own agent and tailor every
              detail
            </p>
            <Link
              onClick={() => setIsCreateAgentModalOpen(false)}
              to='/create-agent'
            >
              <button>Create AI Agent</button>
            </Link>
          </div>
          <div className='magic'>
            <h3>Magic Build</h3>
            <p>
              Enter the token's contract address We will design the most
              suitable agent for you
            </p>
            <Link
              onClick={() => setIsCreateAgentModalOpen(false)}
              to='/magic-build'
            >
              <button>Create AI Agent</button>
            </Link>
          </div>
        </div>
      </Modal>
    </aside>
  );
}
