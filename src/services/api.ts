import { toFixedNumber } from "../utils/index.ts";

import axios from "axios";
import { api } from "./apiconfig.ts";

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

const BASE_URL_BALANCE = "https://balance-servie.onrender.com";
const BASE_URL_CHAT = "https://chat-service-rq16.onrender.com";
export const getMessages = async (
  page: number = 1,
  limit = 20,
  instanceId: number = 1
) => {
  try {
    // const { data } = await axios.get(
    //   `${BASE_URL1}/posts?_page=${page}&_limit=${limit}`
    // );
    const { data } = await axios.get(
      `${BASE_URL_CHAT}/messages/${instanceId}?limit=${limit}&offset=${page}`
    );
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const connectAddress = async (address: string, instance: number = 1) => {
  const body = {
    address: address,
    sts: "online",
    instanceId: instance,
  };
  try {
    const { data } = await axios.post(`${BASE_URL_BALANCE}/address`, body);
    return data;
  } catch (error) {
    console.log("ADD_ADDRESS_Error", error);
    throw error;
  }
};

export const createInstance = async (payload: any) => {
  delete payload?.chainId; // TODO: REMOVE THIS AFTER BE ADDS CHAINID
  try {
    const { data } = await axios.post(`${BASE_URL_CHAT}/grp-intance`, payload);
    console.log("CREATE_INSTANCE", data);
    return data;
  } catch (error) {
    console.log("ADD_ADDRESS_Error", error);
    throw error;
  }
};

export const updateChatInstance = async (
  link: string,
  minTokenValue: string,
  instanceId: number
) => {
  try {
    const { data } = await axios.patch(
      `${BASE_URL_CHAT}/grp-intance/${instanceId}`,
      {
        streamUrl: link,
        minTokenValue: Number(minTokenValue),
      }
    );
    return data;
  } catch (error) {
    console.log("Update_Instance_Error", error);
    throw error;
  }
};

export const getChatInstanceAdmin = async (instance: number = 1) => {
  try {
    const { data } = await axios.get(
      `${BASE_URL_BALANCE}/address/instance/${instance}`
    );
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getChatInstanceWithAgentId = async (agentId: string) => {
  try {
    const { data } = await axios.get(`${BASE_URL_CHAT}/grp-intance/${agentId}`);
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getSuperChatsWithInstanceId = async (instanceId: number) => {
  try {
    const { data } = await axios.get(
      `${BASE_URL_CHAT}/messages/superchat/${instanceId}`
    );
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getMutedUsersWithInstanceId = async (instanceId: number) => {
  try {
    const { data } = await axios.get(
      `${BASE_URL_CHAT}/messages/mute/${instanceId}`
    );
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getAllUsersbyInstanceId = async (instanceId: number) => {
  try {
    const { data } = await axios.get(
      `${BASE_URL_BALANCE}/address/${instanceId}`
    );
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const addModeratorToChatInstance = async (payload: {
  admin: string;
  moderators: string;
  instanceId: number;
}) => {
  const { admin, moderators, instanceId } = payload;
  try {
    const { data } = await axios.patch(
      `${BASE_URL_BALANCE}/address/instance/add/${instanceId}`,
      {
        admin,
        moderators,
      }
    );
    return data;
  } catch (error) {
    console.error("Add Moderator Error", error);
    throw error;
  }
};

export const removeModeratorFromChatInstance = async (payload: {
  admin: string;
  moderators: string;
  instanceId: number;
}) => {
  const { admin, moderators, instanceId } = payload;
  try {
    const { data } = await axios.patch(
      `${BASE_URL_BALANCE}/address/instance/remove/${instanceId}`,
      {
        admin,
        moderators,
      }
    );
    return data;
  } catch (error) {
    console.error("Remove Moderator Error", error);
    throw error;
  }
};

export const uploadSingleFile = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post("/upload/single", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data.url;
  } catch (error) {
    console.error("Error uploading file", error);
    throw error;
  }
};

export const createAgent = async (data: any) => {
  try {
    const response = await api.post("/agent", data);

    return response.data;
  } catch (error) {
    console.error("Error", error);
    throw error;
  }
};

export const getAllAgents = async () => {
  try {
    const response = await api.get("/agent");
    return response.data;
  } catch (error) {
    console.error("Error", error);
    throw error;
  }
};

export const getAllAgentByUser = async () => {
  try {
    const { data } = await api.get("/agent/byuid");
    return data;
  } catch (error) {
    console.error("Error", error);
    throw error;
  }
};

export const connectWithTelegram = async (data: {
  token: string;
  aId: string;
}) => {
  try {
    const response = await axios.post(
      "https://tele-ai-bot.onrender.com/bot",
      data
    );
    console.log("RESPONSE", response);
    return response.data;
  } catch (error) {
    console.error("Error", error);
    throw error;
  }
};
