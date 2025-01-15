// export async function getTokenDetails(tokenAddress : string) {
//   const url =
//     `https://api.coingecko.com/api/v3/coins/ethereum/contract/${tokenAddress}`;
//     const timeStampUrl = `https://api.etherscan.io/v2/api?chainid=1&module=contract&action=getcontractcreation&contractaddresses=${tokenAddress}&apikey=IIQF1RE4TP86VDXC27Z9CYMS3GKZQYXYK1`;

import {  toFixedNumber } from '../utils/index.ts';

//   try {
//     const response = await fetch(url);
//     const timeResponse = await fetch(timeStampUrl)
//     const createdAt = await  timeResponse.json()
//     const data = await response.json();
//     console.log("Token Details:", data);
//  return {...data, contract_creation: createdAt.result[0]};

//   } catch (error: any) {
//     console.error(
//       "Error fetching token details:",
//       error.response?.data || error.message
//     );
//   }
// }


export async function getTokenDetails(tokenAddress: string) {

  const eth_key = import.meta.env.VITE_ETHERSCAN_API_KEY
  const apiUrl = `https://api.dexscreener.com/latest/dex/tokens/${tokenAddress}`;
  const geckoApi =`https://api.geckoterminal.com/api/v2/networks/eth/tokens/${tokenAddress}?include=top_pools
`
  const creationUrl = `https://api.etherscan.io/v2/api?chainid=1&module=contract&action=getcontractcreation&contractaddresses=${tokenAddress}&apikey=${eth_key}`;
const holdersUrl = `https://api.etherscan.io/v2/api?chainid=1&module=token&action=tokenholdercount&contractaddress=${tokenAddress}&apikey=${eth_key}`
  try {
    const [tokenResponse, creationResponse] = await Promise.all([
      fetch(geckoApi),
      fetch(creationUrl),

    ]);

    if (!tokenResponse.ok || !creationResponse.ok) {
      throw new Error('Failed to fetch data from one or both APIs');
    }

    const tokenData = await tokenResponse.json();
    const creationData = await creationResponse.json();
    // const holdersData = await holdersResponse.json();

    console.log("Token Details:", tokenData, extractPoolData(tokenData) );

    return {
      ...extractPoolData(tokenData),
      contract_address: tokenAddress,
      contract_creation: creationData.result?.[0] || null
    };
  } catch (error: any) {
    console.error("Error fetching token details:", error.message || error);
    throw error;
  }
}

const createObjectFromPair = (pair: any) => {
  const baseToken = pair.baseToken;
  const quoteToken = pair.quoteToken;
  const priceChange24h = pair.priceChange.h24;

  // console.log(pair);
  

  return {
    name: baseToken.name,

    symbol: baseToken.symbol,
    priceInUsd: pair.priceUsd,
    volume: pair.volume.h24,
    volume24hChange: priceChange24h,
    priceChange24h: priceChange24h,
    liquidity: pair.liquidity.usd,
    marketCapUsd: pair.marketCap,
    pairAddress: pair.pairAddress,
    imageUrl: pair?.info?.imageUrl || '',
    header: pair?.info?.header || "",
    website: pair?.info?.websites.find((site: any) => site.label === "Website")?.url || '',
    twitter: pair?.info?.socials.find((social: any) => social.type === "twitter")?.url || '',
    telegram: pair?.info?.socials.find((social:any) => social.type === "telegram")?.url || ''
  };
};

function extractPoolData(data: any) {
  const tokenData = data.data.attributes;

  const pool = data.included[0]; // Get the first pool

  return {
    name: tokenData.name,
    symbol: tokenData.symbol,
    priceInUsd: toFixedNumber(pool.attributes.token_price_usd),
    volume: toFixedNumber(pool.attributes.volume_usd.h24),
    volume24hChange: pool.attributes.price_change_percentage.h24,
    priceChange24h: pool.attributes.price_change_percentage.h24,
    liquidity: toFixedNumber(tokenData.total_reserve_in_usd),
    marketCapUsd: toFixedNumber(pool.attributes.market_cap_usd),
    pairAddress: pool.id,
    imageUrl: tokenData.image_url,
    fdvInusd: tokenData.fdv_usd
  };
}

import axios from "axios";

const BASE_URL_BALANCE = "https://balance-servie.onrender.com";
const BASE_URL_CHAT = "https://chat-service-rq16.onrender.com";

export const getMessages = async (page: number, limit = 20) => {
  try {
    // const { data } = await axios.get(
    //   `${BASE_URL1}/posts?_page=${page}&_limit=${limit}`
    // );
    const { data } = await axios.get(
      `${BASE_URL_CHAT}/messages?limit=${limit}&offset=${page}`
    );
    console.log("DATA", data);
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const connectAddress = async (address: string) => {
  const body = {
    address: address,
    sts: "online",
  };
  try {
    const { data } = await axios.post(`${BASE_URL_BALANCE}/address`, body);
    return data;
  } catch (error) {
    console.log("ADD_ADDRESS_Error", error);
    throw error;
  }
};
