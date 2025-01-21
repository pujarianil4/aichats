import { ConnectButton, useConnectModal } from "@rainbow-me/rainbowkit";
import "./index.scss";
import { Button, Modal } from "antd";
import { Link } from "react-router-dom";
import { useAccount } from "wagmi";
import { useState } from "react";
import LammaLogo from "./../../assets/logo.png";
function Navbar() {
  const { address, isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const [openModal, setOpenModal] = useState(false);

  const showModal = () => {
    setOpenModal(true);
  };

  const handleOk = () => {
    setTimeout(() => {
      setOpenModal(false);
    }, 3000);
  };

  const handleCancel = () => {
    setOpenModal(false);
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
          <Button onClick={showModal}> Create New Agent </Button>
          {/* </Link> */}
          {isConnected ? (
            <ConnectButton showBalance={false} />
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
