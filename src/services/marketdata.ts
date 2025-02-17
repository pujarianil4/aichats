import { Address } from 'viem';
import { toFixedNumber } from "../utils/index.ts";

import axios from "axios";


export async function getTokenDetails(network: string, tokenAddress: string) {
  const eth_key = import.meta.env.VITE_ETHERSCAN_API_KEY;
  const apiUrl = `https://api.dexscreener.com/latest/dex/tokens/${tokenAddress}`;
  const geckoApi = `https://api.geckoterminal.com/api/v2/networks/${network}/tokens/${tokenAddress}?include=top_pools
`;
  const creationUrl = `https://api.etherscan.io/v2/api?chainid=1&module=contract&action=getcontractcreation&contractaddresses=${tokenAddress}&apikey=${eth_key}`;
  const holdersUrl = `https://api.etherscan.io/v2/api?chainid=1&module=token&action=tokenholdercount&contractaddress=${tokenAddress}&apikey=${eth_key}`;
  try {
    const [tokenResponse, creationResponse] = await Promise.all([
      fetch(geckoApi),
      fetch(creationUrl),
    ]);

    if (!tokenResponse.ok || !creationResponse.ok) {
      throw new Error("Failed to fetch data from one or both APIs");
    }

    const tokenData = await tokenResponse.json();
    const creationData = await creationResponse.json();
    // const holdersData = await holdersResponse.json();

    // console.log("Token Details:", tokenData, extractPoolData(tokenData));

    return {
      ...extractPoolData(tokenData),
      contract_address: tokenAddress,
      contract_creation: creationData.result?.[0] || null,
    };
  } catch (error: any) {
    console.error("Error fetching token details:", error.message || error);
    throw error;
  }
}

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
    tvl: toFixedNumber(tokenData.total_reserve_in_usd),
    marketCapUsd: toFixedNumber(pool.attributes.market_cap_usd),
    pairAddress: pool.id,
    imageUrl: tokenData.image_url,
    fdvInusd: tokenData.fdv_usd,
    pools: data.included,
  };
}

export const getTotalTokenHolders = async (network: string, poolAddress: string| Address)=> {

  try {
    let data = JSON.stringify({
      "query": "query MyQuery($network: evm_network, $token: String, $time_ago: DateTime) {\n  EVM(network: $network) {\n    BalanceUpdates(\n      orderBy: {descendingByField: \"balance\"}\n      limit: {count: 50}\n      where: {Currency: {SmartContract: {is: $token}}, Block: {Time: {since: $time_ago}}}\n    ) {\n      BalanceUpdate {\n        Address\n      }\n      balance: sum(of: BalanceUpdate_Amount, selectWhere: {gt: \"0\"})\n    }\n  }\n}\n",
      "variables": "{}"
   });
   
   let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://streaming.bitquery.io/eap',
      headers: { 
         'Content-Type': 'application/json', 
         'Authorization': 'Bearer ory_at_Q3KlWVRiHGKHEpK6AfIgtY-4KAnBrasT5JH8pyj-xK0.BTEnw-zN_KGRjWldBDGPd69IXFtXZVYwO4MiZGyJIMI'
      },
      data : data
   };
   
   const res = await axios.request(config)

   
  } catch (error) {
    console.log("Error", error);
    
  }
}

function findHolderCountByBaseToken(data: any) {
  // const baseTokenId = data.data.attributes.base_token_id;
  console.log("findHolderCountByBaseToken", data);
  
  // // Search through included items
  // for (const item of data.included) {
  //   if (item.type === 'token_security_metric') {
  //     // Check if related token matches base_token_id
  //     if (item.relationships.token.data.id === baseTokenId) {
  //       return item.attributes.holder_count;
  //     }
  //   }
  // }
  
  // return null; // Return null if not found
}

