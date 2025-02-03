import React from "react";
import "./index.scss";
import LammaLogo from "./../../assets/logo.png";
import UnilendLogo from "../../assets/unilend.png";
import { FaXTwitter } from "react-icons/fa6";

import { FaTelegramPlane } from "react-icons/fa";
import { FaRegFileAlt } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className='footer'>
      <div className='logo_div'>
        <div className='logo'>
          <img src={LammaLogo} alt='Lamaa Logo' className='footer__logo' />
        </div>

        <div className='footer_social'>
          <span>
            <FaRegFileAlt />
          </span>
          <span>
            <FaTelegramPlane />
          </span>

          <span>
            <FaXTwitter />
          </span>
          <span>
            <FaXTwitter />
          </span>
        </div>
      </div>
      <div className='copyright_div'>
        <p>© {new Date().getFullYear()} Lamaa.io All Rights Reserved.</p>
        <div className='footer_info'>
          <span>Made with Love</span>
          <img src={UnilendLogo} alt='UniLend' className='footer_icon' />
        </div>
      </div>

      <div className='disclaimer_div'>
        <p>Disclaimer</p>
        <div className='footer_token'>
          <span>$LAMAA</span>
          <button className='footer__contract'>0x0b3e...4e7E1b</button>
        </div>
      </div>
      <div className='social_bx'>
        <p></p>
        <nav className='footer_nav'>
          <a href='/about'>About</a>
          <a href='/writing'>Writing</a>
          <a href='/protocol'>Protocol</a>
          <a href='/legacy'>Legacy</a>
          <a href='/governance'>Governance Forum</a>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
