import React from "react";
import "./sidePanel.scss";

type prop = {
  tokenDetails: any;
};
const USD = "usd";

export function getColorForValue(value: number): string {
  return value < 0 ? "#D40000" : "#00e832";
}
export default function SidePanel({ tokenDetails }: prop) {
  return (
    <div className='sidepanel'>
      <div className='swap'></div>
      <div className='analytics'>
        <div className='analytics__title'>
          <h3>Token Data</h3>
        </div>
        <div className='analytics_data'>
          <div>
            <p className='label'>Price</p>
            <p>${tokenDetails.market_data.current_price[USD]}</p>
          </div>
          <div>
            <p className='label'>Market Cap</p>
            <p>${tokenDetails.market_data.market_cap[USD]}</p>
          </div>
          <div>
            <p className='label'>TVL </p>
            <p>${tokenDetails.market_data.total_value_locked[USD]}</p>
          </div>
          <div>
            <p className='label'>MC Rank</p>
            <p>{tokenDetails.market_data.market_cap_rank}</p>
          </div>
        </div>
        <div className='analytics_data1'>
          <div>
            <p className='label'>24h change</p>
            <p
              style={{
                color: getColorForValue(
                  tokenDetails.market_data.price_change_percentage_24h
                ),
              }}
            >
              {tokenDetails.market_data.price_change_percentage_24h}%
            </p>
          </div>
          <div>
            <p className='label'>Volume</p>
            <p>${tokenDetails.market_data.total_volume[USD]}</p>
          </div>
          <div>
            <p className='label'>Holders</p>
            <p>456789</p>
          </div>
        </div>
      </div>
      <div className='developer_profile'>
        <h3>Developer</h3>

        <div className='info'>
          <div className='img'></div>
          <p>07654ewertyuio98765435678987654</p>
        </div>
        <div className='social'>
          <p>View Profile</p>
        </div>
      </div>
    </div>
  );
}
