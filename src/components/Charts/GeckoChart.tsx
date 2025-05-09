import React from "react";
import "./index.scss";

export default function GeckoChart({
  network,
  poolAddress,
}: {
  network: string;
  poolAddress: string;
}) {
  return (
    <div className='chart_container'>
      <iframe
        height='100%'
        width='100%'
        id='geckoterminal-embed'
        title='GeckoTerminal Embed'
        src={`https://www.geckoterminal.com/${network}/pools/${poolAddress}?embed=1&info=0&swaps=0&grayscale=2&dark_chart=4`}
        allow='clipboard-write'
        allowFullScreen
      ></iframe>
    </div>
  );
}
