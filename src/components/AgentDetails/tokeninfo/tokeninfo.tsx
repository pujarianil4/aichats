import "./tokeninfo.scss";
import GeckoChart from "../../Charts/GeckoChart.tsx";

import Tabs from "../../common/Tabs/Tabs.tsx";
import DetailsTab from "./detailsTab/detailsTab.tsx";
import DeveloperTab from "./developerTab/developer.tsx";
import HolderTab from "./holderTab/holder.tsx";
import {
  setFallbackURL,
  shortenAddress,
  timeAgo,
} from "../../../utils/index.ts";
import { useQuery } from "@tanstack/react-query";
import { getTotalTokenHolders } from "../../../services/marketdata.ts";
import { useEffect } from "react";

type prop = {
  tokenDetails: any;
  activeTab: string;
};

export default function TokenInfo({ tokenDetails, activeTab }: prop) {
  const poolAddress = String(tokenDetails.tokenData.pools[0].id).split("_")[1];
  console.log("active tab", activeTab);
  const {
    data: tokenHolders,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["totalHolders"],
    queryFn: () => getTotalTokenHolders("base", poolAddress),
  });
  const tabItems = [
    {
      key: "1",
      label: "Details",
      children: <DetailsTab tokenDetails={tokenDetails} />,
    },
    {
      key: "2",
      label: "Developer",
      children: <DeveloperTab tokenDetails={tokenDetails} />,
    },
    {
      key: "3",
      label: "Holders",
      children: <HolderTab tokenDetails={tokenDetails} />,
    },
  ];
  useEffect(() => {
    console.log("holders", tokenHolders);
  }, [tokenHolders]);

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

      <div className={`details ${activeTab === "info" ? "show" : "hide"}`}>
        <Tabs items={tabItems} />
      </div>
    </div>
  );
}
