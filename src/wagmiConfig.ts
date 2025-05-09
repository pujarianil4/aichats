import {
  RainbowKitProvider,
  getDefaultWallets,
  getDefaultConfig,
} from "@rainbow-me/rainbowkit";
import { WagmiProvider, http } from "wagmi";
import { mainnet, base, arbitrum, polygon } from "wagmi/chains";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import {
  rabbyWallet,
  trustWallet,
  okxWallet,
  coin98Wallet,
  bitgetWallet,
  phantomWallet,
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

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
    },
  },
});
