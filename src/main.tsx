import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./styles/antd.scss";
import "./styles/index.scss";
import App from "./App.tsx";
import ReactDOM from "react-dom/client";
//rainbowkit integration
import "@rainbow-me/rainbowkit/styles.css";
import {
  RainbowKitProvider,
  getDefaultWallets,
  getDefaultConfig,
} from "@rainbow-me/rainbowkit";
import { WagmiProvider, http } from "wagmi";
import { mainnet, base, arbitrum, polygon } from "wagmi/chains";
import { darkTheme } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConfigProvider } from "antd";

import {
  metaMaskWallet,
  rabbyWallet,
  trustWallet,
  okxWallet,
  coin98Wallet,
  bitgetWallet,
  phantomWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";

const { wallets } = getDefaultWallets();

export const wagmiConfig = getDefaultConfig({
  appName: "Super chat",
  projectId: "project_id",
  chains: [mainnet, base, arbitrum, polygon],
  wallets: [
    ...wallets,
    {
      groupName: "Recommended",
      wallets: [
        metaMaskWallet,
        walletConnectWallet,
        rabbyWallet,
        trustWallet,
        okxWallet,
        coin98Wallet,
        bitgetWallet,
        phantomWallet,
      ],
    },
  ],
  transports: {
    [mainnet.id]: http(),
    [base.id]: http(),
    [arbitrum.id]: http(),
    [polygon.id]: http(),
  },
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme()}>
          <ConfigProvider
            theme={{
              token: {
                // Seed Token
                colorPrimary: "#FF00B7",
                colorTextSecondary: "#FF00B7",
                borderRadius: 2,

                // Alias Token
                colorBgContainer: "#1c1c1c",

                colorText: "#fffff",
                boxShadow: "0px",
              },
              components: {
                Table: {
                  headerColor: "#FF00B7",
                },
                Pagination: {
                  itemActiveBg: "#FF00B7",
                },
              },
            }}
          >
            <App />
          </ConfigProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </StrictMode>
);
