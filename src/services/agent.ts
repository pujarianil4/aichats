import { Address } from "viem";
import { api } from "./apiconfig.ts";
import { getTokenDetails } from "./api.ts";

export const getAgentByID = async (agentId: string) => {
  try {
    const response = await api.get(`/agent/${agentId}`);
    const tokenData = await getMaketDataByTokenAddress(
      "base",
      response.data.token.tCAddress
    );
    return { ...response.data, tokenData };
  } catch (error) {
    console.error("Error", error);
    throw error;
  }
};

export const getMaketDataByTokenAddress = async (
  network: string,
  address: Address
) => {
  try {
    const response = await getTokenDetails(network, address);

    console.log("token", response);

    return response;
  } catch (error) {
    console.error("Error", error);
    throw error;
  }
};

//fetch data for myagents
export const getMyAgentData = async (agentId: string) => {
  try {
    console.log("agentId", agentId);
    const response = await api.get(`/agent/private/${agentId}`);
    const tokenData = await getMaketDataByTokenAddress(
      "base",
      response.data.token.tCAddress
    );
    return { ...response.data, tokenData };
  } catch (error) {
    console.error("Error", error);
    throw error;
  }
};

export const updateAgentData = async (agentId: string, data: any) => {
  try {
    const response = await api.patch(`/agent/${agentId}`, data);
    const tokenData = await getMaketDataByTokenAddress(
      "base",
      response.data.token.tCAddress
    );
    return { ...response.data, tokenData };
  } catch (error) {
    console.error("Error", error);
    throw error;
  }
};
