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
    return response.data;
  } catch (error) {
    console.error("Error", error);
    throw error;
  }
};

export const getKBbyAgentID = async (agentID: string) => {
  try {
    const response = await api.get(`/upload/kb/${agentID}`);
    return response.data;
  } catch (error) {
    console.error("Error", error);
    throw error;
  }
};

export const uploadTextByAgent = async (agentID: string, payload: any) => {
  try {
    const response = await api.post(`/upload/kb/txt/${agentID}`, payload);
    return response.data;
  } catch (error) {
    console.error("Error", error);
    throw error;
  }
};

export const deleteKbByAgent = async (agentID: string, payload: any) => {
  try {
    const response = await api.delete(`/upload/kb/${agentID}`, payload);
    return response.data;
  } catch (error) {
    console.error("Error", error);
    throw error;
  }
};

export const getOnetoOneChatSession = async (agentID: string) => {
  try {
    const { data } = await api.get(`/chat-session?aId=${agentID}`);
    return data;
  } catch (error) {
    console.error("Error", error);
    throw error;
  }
};

export const getOnetoOneChatHistoryBySession = async (sessionID: string) => {
  try {
    const { data } = await api.get(`/chat-message/${sessionID}`);
    return data;
  } catch (error) {
    console.error("Error", error);
    throw error;
  }
};

export const deleteOnetoOneChatHistory = async (sessionID: string) => {
  try {
    await api.delete(`/chat-message/${sessionID}`);
  } catch (error) {
    console.log("Error", error);
    throw error;
  }
};

export const createOnetoOneChatSession = async (agentID: string) => {
  try {
    const { data } = await api.post(`/chat-session`, { aId: agentID });
    return data;
  } catch (error) {
    console.error("Create Session Error", error);
    throw error;
  }
};

export const chatWithOnetoOneAgent = async (payload: any) => {
  try {
    const { data } = await api.post(`/chat-message`, payload);
    return data;
  } catch (error) {
    console.error("Error", error);
    throw error;
  }
};
