import React, { useEffect, useRef, useState } from "react";
import "./index.scss";

import type { TabsProps } from "antd";
import SocialLinks from "../socialLinks/index.tsx";
// import SocialLinks from "../socialLinks/twitterTab/index.tsx";
import { FaCopy } from "react-icons/fa";
import { FaDiscord, FaTelegram } from "react-icons/fa";
import { BsTwitterX } from "react-icons/bs";
export default function MyAgents() {
  const [telegramUser, setTelegramUser] = useState<string | null>("@sandeep22");
  const [discordUser, setDiscordUser] = useState<string | null>("@sandeep");
  const [xUser, setXUser] = useState<string | null>("@sandeep2032213");

  return (
    // <div className='create_agent_container'>
    //   hii

    //   <SocialLinks />
    // </div>

    <div className='agent-details-container'>
      <div className='agent-header'>
        <img
          src='https://via.placeholder.com/60'
          alt='Agent Avatar'
          className='agent-avatar'
        />
        <div>
          <div className='agent-info'>
            <div className='agent-name'>Sandeep Rajput</div>
            <div className='edit-button'>Edit</div>
          </div>
          <div className='social-links'>
            <div className='social_tag'>
              0x43fd....2334 <FaCopy />
            </div>
            <div className='social_tag'>
              <BsTwitterX /> {xUser ? xUser : "X"}
            </div>
            <div className='social_tag'>
              <FaDiscord /> {discordUser ? discordUser : "Discord"}
            </div>
            <div className='social_tag'>
              <FaTelegram /> {telegramUser ? telegramUser : "Telegram"}
            </div>
          </div>
        </div>
      </div>

      <SocialLinks />
    </div>
  );
}
