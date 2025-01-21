import React from "react";
import "./tokeninfo.scss";
import GeckoChart from "../../Charts/GeckoChart.tsx";
import { shortenAddress, timeAgo } from "../../../utils/index.ts";

type prop = {
  tokenDetails: any;
};
const USD = "usd";
export default function TokenInfo({ tokenDetails }: prop) {
  return (
    <div className='tokeninfo'>
      <div className='basic'>
        <div className='content'>
          <div className='tokenlogo'>
            <img src={tokenDetails?.imageUrl} alt='' />
          </div>
          <div className='info'>
            <h2>
              {tokenDetails?.name} <span>@{tokenDetails?.symbol}</span>
            </h2>

            <div>
              <p>{shortenAddress(tokenDetails?.contract_address)}</p>
              <p>Production</p>
            </div>
          </div>
        </div>
        <div className='market'>
          <div>
            <p className='label'>Price</p>
            <p>${tokenDetails.priceInUsd}</p>
          </div>
          <div>
            <p className='label'>Market Cap</p>
            <p>${tokenDetails.marketCapUsd}</p>
          </div>
          <div>
            <p className='label'>Created at</p>
            <p> {timeAgo(tokenDetails.contract_creation.timestamp)}</p>
          </div>
        </div>
      </div>
      <GeckoChart />

      <div className='details'>
        <h2>Biography</h2>
        <p>fghj</p>
      </div>
    </div>
  );
}
