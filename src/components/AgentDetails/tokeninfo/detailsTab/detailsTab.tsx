import React from "react";
import { Button, Card } from "antd";
import { AiOutlineTwitter } from "react-icons/ai";
import { FaTelegramPlane } from "react-icons/fa";
import { LinkOutlined } from "@ant-design/icons";
import "./index.scss";

type Props = {
  tokenDetails: any;
};

const DetailsTab = ({ tokenDetails }: Props) => {
  return (
    <div className='details-tab'>
      <div className='biography'>
        <h2>Biography</h2>
        <p>{tokenDetails.desc}</p>
      </div>

      {/* Capabilities Section */}
      <div className='capabilities'>
        <h2>Capabilities</h2>
        <div className='capabilities-buttons'>
          {[
            "Wait",
            "Post Tweet",
            "Reply Tweet",
            "Follow Account",
            "Like Tweet",
            "Quote Tweet",
            "Retweet",
            "Get Last Post Comments",
            "Search Internet",
          ].map((capability) => (
            <Button key={capability} className='capability-btn'>
              {capability}
            </Button>
          ))}
        </div>
      </div>

      {/* Socials Section */}
      <div className='socials'>
        <h2>Socials</h2>
        <div className='socials-container'>
          <div className='social-card'>
            <AiOutlineTwitter className='social-icon' />
            <div className='social-info'>
              <div className='social-name'>AIXBT</div>
              <div className='social-access'>Twitter Bot Access</div>
            </div>
            <LinkOutlined className='link-icon' />
          </div>
          <div className='social-card'>
            <FaTelegramPlane className='social-icon' />
            <div className='social-info'>
              <div className='social-name'>AIXBT</div>
              <div className='social-access'>Telegram Bot Access</div>
            </div>
            <LinkOutlined className='link-icon' />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsTab;
