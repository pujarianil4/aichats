import "./sidePanel.scss";
import TwitterFeed from "../twitterFeed/index.tsx";
import Cowswap from "../cowSwap/index.tsx";
import BondingCurve from "./bondingCurve/index.tsx";
type prop = {
  tokenDetails: any;
};

export function getColorForValue(value: number): string {
  return value < 0 ? "#D40000" : "#00e832";
}
export default function SidePanel({ tokenDetails }: prop) {
  return (
    <div className='sidepanel'>
      <div className='swap'>
        <Cowswap />
      </div>
      {/* 
      <BondingCurve /> */}

      <div className='analytics'>
        <div className='analytics__title'>
          <h3>Token Data</h3>
        </div>
        <div className='analytics_data'>
          <div>
            <p className='label'>Price</p>
            <p>${tokenDetails.tokenData.priceInUsd}</p>
          </div>
          <div>
            <p className='label'>Market Cap</p>
            <p>${tokenDetails.tokenData.marketCapUsd}</p>
          </div>
          <div>
            <p className='label'>TVL </p>
            <p>${tokenDetails.tokenData.tvl}</p>
          </div>
          {/* <div>
            <p className='label'>MC Rank</p>
            <p>{tokenDetails.market_data.market_cap_rank}</p>
          </div> */}
        </div>
        <div className='analytics_data1'>
          <div>
            <p className='label'>24h change</p>
            <p
              style={{
                color: getColorForValue(tokenDetails.tokenData.priceChange24h),
              }}
            >
              {tokenDetails.tokenData.priceChange24h}%
            </p>
          </div>
          <div>
            <p className='label'>Volume</p>
            <p>${tokenDetails.tokenData.volume}</p>
          </div>
          <div>
            <p className='label'>FDV</p>
            <p>${tokenDetails.tokenData.fdvInusd}</p>
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

      <div className='developer_profile'>
        <TwitterFeed />
      </div>
    </div>
  );
}
