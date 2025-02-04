import {
  ConnectButton,
  useConnectModal,
  useChainModal,
} from "@rainbow-me/rainbowkit";
import "./index.scss";
import { Button, message, Modal, Popover } from "antd";
import { Link, useNavigate } from "react-router-dom";
import {
  useAccount,
  useSignMessage,
  useDisconnect,
  useSwitchChain,
} from "wagmi";
import { useEffect, useRef, useState } from "react";
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
import { getTokens } from "../../services/apiconfig.ts";
import CPopup from "../common/CPopup/Cpopup.tsx";
import { IoSearch } from "react-icons/io5";

function Navbar() {
  const { address, isConnected } = useAccount();
  const sign = useSignMessage();
  const { disconnect } = useDisconnect();
  const { openChainModal } = useChainModal();

  const { openConnectModal } = useConnectModal();
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);

  const [isSearchExpanded, setSearchExpanded] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      searchRef.current &&
      !searchRef.current.contains(event.target as Node)
    ) {
      setSearchExpanded(false);
    }
  };

  useState(() => {
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  });

  const { isLoading, profile, error } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const cookies = getTokens();

  const showModal = () => {
    isConnected ? setOpenModal(true) : openConnectModal();
  };

  const handleOk = () => {
    setTimeout(() => {
      setOpenModal(false);
    }, 3000);
  };

  const handleCancel = () => {
    setOpenModal(false);
  };

  const handleMsgSign = async () => {
    const hash = sign.signMessage(
      { message: authSignMsg },
      {
        onSuccess(data, variables, context) {
          console.log(data);
          handleAuthConnect({ sig: data, msg: authSignMsg, typ: "EVM" });
        },
        onError(error, variables, context) {
          disconnect();
        },
      }
    );
    console.log(hash, sign);
  };

  useEffect(() => {
    if (isConnected && !cookies.token && profile.isLogedIn == "no") {
      handleMsgSign();
    }
  }, [isConnected, profile]);

  useEffect(() => {
    if (isConnected && error.includes("expired")) {
      message.error("Session Expired,Please Login Again!");
      navigate("/");
      disconnect();
    }
  }, [isConnected, error]);

  const handleDisconnect = async () => {
    try {
      await handleAuthDisconnect();
      dispatch(setUserError("Disconnected"));
      navigate("/");
      disconnect();
    } catch (error) {}
  };

  const menuActions: Record<string, () => void> = {
    "Create Agent": () => setOpenModal(true),
    Sentient: () => navigate("/sentient"),
    Prototype: () => navigate("/prototype"),
    About: () => navigate("/about"),
  };
  if (isConnected) {
    menuActions["My Agents"] = () => navigate("/myagent");
  }

  const handleMenuSelect = (label: string) => {
    const action = menuActions[label];
    if (action) action();
  };

  return (
    <>
      <div className='navbar_container'>
        <div className='navigation'>
          <a href='/'>
            <img src={LammaLogo} alt='logo' />
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
        <div className='search' onClick={() => setSearchExpanded(true)}>
          <IoSearch className='search-icon' size={22} />
          <input
            ref={searchRef}
            type='text'
            className={`search-input ${isSearchExpanded ? "expanded" : ""}`}
            placeholder='Search...'
            onFocus={() => setSearchExpanded(true)}
          />
        </div>
        <div className='actions'>
          {/* <Link to={"/create-agent"}> */}{" "}
          {isConnected && (
            <a href={`/myagent`}>
              <Button className='hide' type='primary'>
                My Agents
              </Button>
            </a>
          )}
          <Button className='hide' onClick={showModal}>
            Create New Agent
          </Button>
          {/* </Link> */}
          {isConnected ? (
            <CPopup
              onSelect={(label) => {
                if (label === "Disconnect") handleDisconnect();
                if (label === "Switch Network") openChainModal();
              }}
              onAction='click'
              position='bottomRight'
              list={[{ label: "Disconnect" }, { label: "Switch Network" }]}
            >
              <Button type='primary' className='address'>
                {address && shortenAddress(address)}
              </Button>
            </CPopup>
          ) : (
            <Button onClick={openConnectModal} type='primary'>
              Connect Wallet
            </Button>
          )}
        </div>
        <div className='mobile'>
          <CPopup
            onSelect={handleMenuSelect}
            onAction='click'
            position='bottomRight'
            list={Object.keys(menuActions).map((label) => ({ label }))}
          >
            <div className='other'>
              <RxHamburgerMenu color='#ff00b7' size={24} />
            </div>
          </CPopup>
        </div>
      </div>
      <Modal
        open={openModal}
        title={"Create New AI Agent"}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <div className='modal_content'>
          <div className='manual'>
            <h3>Manual Build</h3>
            <p>
              Manually input parameters Build your own agent and tailor every
              detail
            </p>
            <Link onClick={handleCancel} to={"/create-agent"}>
              {" "}
              <button>Create AI Agent</button>{" "}
            </Link>
          </div>
          <div className='magic'>
            <h3>Magic Build</h3>
            <p>
              Enter the token's contract address We will design the most
              suitable agent for you
            </p>
            <Link onClick={handleCancel} to={"/magic-build"}>
              <button>Create AI Agent</button>
            </Link>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default Navbar;
