import "./tokeninfo.scss";
import GeckoChart from "../../Charts/GeckoChart.tsx";
import {
  setFallbackURL,
  shortenAddress,
  timeAgo,
} from "../../../utils/index.ts";

type prop = {
  tokenDetails: any;
};

export default function TokenInfo({ tokenDetails }: prop) {
  const poolAddress = String(tokenDetails.tokenData.pools[0].id).split("_")[1];

  console.log("tokenDetails", tokenDetails, poolAddress);

  return (
    <div className='tokeninfo'>
      <div className='basic'>
        <div className='content'>
          <div className='tokenlogo'>
            <img
              src={tokenDetails?.pic}
              alt='agent logo'
              onError={setFallbackURL}
            />
          </div>
          <div className='info'>
            <h2>
              {tokenDetails?.name} <span>@{tokenDetails?.token.tkr}</span>
            </h2>

            <div>
              <p>{shortenAddress(tokenDetails?.token.tCAddress)}</p>
              {tokenDetails.typ != "none" && <p>{tokenDetails.typ}</p>}
            </div>
          </div>
        </div>
        <div className='market'>
          <div>
            <p className='label'>Price</p>
            <p>${tokenDetails.tokenData.priceInUsd}</p>
          </div>
          <div>
            <p className='label'>Market Cap</p>
            <p>${tokenDetails.tokenData.marketCapUsd}</p>
          </div>
          <div>
            <p className='label'>Created at</p>
            {/* <p> {timeAgo(tokenDetails.contract_creation.timestamp)}</p> */}
            <p>5 months ago</p>
          </div>
        </div>
      </div>
      <GeckoChart network='base' poolAddress={poolAddress} />

      <div className='details'>
        <h2>Biography</h2>
        <p>{tokenDetails.desc}</p>
      </div>
    </div>
  );
}
