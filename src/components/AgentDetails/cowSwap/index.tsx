import { useState, useEffect } from "react";
import {
  CowSwapWidget,
  CowSwapWidgetParams,
  TradeType,
} from "@cowprotocol/widget-react";

import { useChainId, useAccount } from "wagmi";

declare global {
  interface Window {
    ethereum: any;
  }
}

function index() {
  const chainId = useChainId();
  const { isConnected } = useAccount();
  const [provider, setProvider] = useState<any>(null);

  useEffect(() => {
    if (isConnected && typeof window !== "undefined" && window.ethereum) {
      setProvider(window.ethereum);
    } else {
      setProvider("");
    }
  }, [isConnected]);

  console.log("chainID", chainId);

  const params: CowSwapWidgetParams = {
    appCode: "Laama Ai Agent",
    width: "100%",
    height: "400px",
    chainId: chainId, // 1 (Mainnet), 100 (Gnosis), 11155111 (Sepolia)
    tokenLists: [
      "https://files.cow.fi/tokens/CoinGecko.json",
      "https://files.cow.fi/tokens/CowSwap.json",
    ],
    tradeType: TradeType.SWAP,
    sell: {
      asset: "WETH",
      amount: "0",
    },
    buy: {
      asset: "USDC",
      amount: "0",
    },
    enabledTradeTypes: [
      // TradeType.SWAP, TradeType.LIMIT and/or TradeType.ADVANCED
      TradeType.SWAP,
      // we can active this later
      // TradeType.LIMIT,
      // TradeType.ADVANCED,
      // TradeType.YIELD,
    ],
    theme: {
      baseTheme: "dark",
      primary: "#7100c7",
      background: "#000000",
      paper: "#1c1c1c",
      text: "#ffffff",
    },
    standaloneMode: false,
    disableToastMessages: false,
    disableProgressBar: false,
    hideBridgeInfo: false,
    hideOrdersTable: false,
    images: {},
    sounds: {},
    customTokens: [],
  };

  return (
    <div className='cowSwap_bx'>
      <CowSwapWidget params={params} provider={provider} />
    </div>
  );
}

export default index;
