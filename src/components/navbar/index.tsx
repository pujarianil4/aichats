import { ConnectButton, useConnectModal } from "@rainbow-me/rainbowkit";
import "./index.scss";
import { Button, message, Modal } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useAccount, useSignMessage, useDisconnect } from "wagmi";
import { useEffect, useState } from "react";
import LammaLogo from "./../../assets/logo.png";
import {
  handleAuthConnect,
  handleAuthDisconnect,
} from "../../services/auth.ts";
import { authSignMsg } from "../../utils/contants.ts";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks.tsx";
import { shortenAddress } from "../../utils/index.ts";
import { setUserError } from "../../contexts/reducers/index.ts";
import { getTokens } from "../../services/apiconfig.ts";
function Navbar() {
  const { address, isConnected } = useAccount();
  const sign = useSignMessage();
  const { disconnect } = useDisconnect();
  const { openConnectModal } = useConnectModal();
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
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

  return (
    <>
      <div className='navbar_container'>
        <div className='navigation'>
          <a href='/'>
            {" "}
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
        <div className='search'>
          <input type='text' placeholder='Search' />
        </div>
        <div className='actions'>
          {/* <Link to={"/create-agent"}> */}{" "}
          {isConnected && (
            <a href={`/myagent`}>
              {" "}
              <Button type='primary'> My Agents</Button>{" "}
            </a>
          )}
          <Button onClick={showModal}> Create New Agent </Button>
          {/* </Link> */}
          {isConnected ? (
            <Button onClick={handleDisconnect} type='primary'>
              {address && shortenAddress(address)}
            </Button>
          ) : (
            <Button onClick={openConnectModal} type='primary'>
              {" "}
              Connect Wallet
            </Button>
          )}
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
