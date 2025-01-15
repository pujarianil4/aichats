import React from "react";
import "./index.scss";
export default function Footer() {
  return (
    <footer className='footer'>
      <div className='rights'>
        <img src='./logo.png' alt='logo' />
        <p>© {new Date().getFullYear()} Lamaa.io All Rights Reserved.</p>
      </div>
      <div className='owner'>
        <p>Made with Love</p>
        <img src='./unilend.png' alt='Unilend logo' />
      </div>
      <div className='more'>
        <div className='social'>
          <a href='#'>
            <img src='./paper.png' alt='whitepaper' />
          </a>
          <a href='#'>
            <img src='./telegram.png' alt='telegram' />
          </a>
          <a href='#'>
            <img src='./x.png' alt='x' />
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
