import { ConnectButton } from "@rainbow-me/rainbowkit";
import "./index.scss";
import { Button } from "antd";
function Navbar() {
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
