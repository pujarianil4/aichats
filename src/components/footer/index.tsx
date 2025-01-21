import React from "react";
import "./index.scss";
import LammaLogo from "./../../assets/logo.png";
import UnilendLogo from "../../assets/unilend.png";
import { FaXTwitter } from "react-icons/fa6";

import { FaFileAlt, FaTelegramPlane } from "react-icons/fa";
export default function Footer() {
  return (
    <footer className='footer'>
      <div className='rights'>
        <img src={LammaLogo} alt='logo' />
        <p>© {new Date().getFullYear()} Lamaa.io All Rights Reserved.</p>
      </div>
      <div className='owner'>
        <p>Made with Love</p>
        <img src={UnilendLogo} alt='Unilend logo' />
      </div>
      <div className='more'>
        <div className='social'>
          <a href='#'>
            {/* <img src='./paper.png' alt='whitepaper' /> */}
            <FaFileAlt size={20} color='#ffff' />
          </a>
          <a href='#'>
            {/* <img src='./telegram.png' alt='telegram' /> */}
            <FaTelegramPlane size={20} color='#ffff' />
          </a>
          <a href='#'>
            {/* <img src='./x.png' alt='x' /> */}
            <FaXTwitter size={20} color='#ffff' />
          </a>
        </div>
        <div className='nav'>
          <ul>
            <li>
              <a href='#'>About</a>
            </li>
            <li>
              <a href='#'>Writing</a>
            </li>
            <li>
              <a href='#'>Protocol</a>
            </li>
            <li>
              <a href='#'>Legacy</a>
            </li>
            <li>
              <a href='#'>Governance Forum</a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
