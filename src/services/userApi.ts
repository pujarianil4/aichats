import { Address } from "viem";
import { api } from "./apiconfig.ts";
import { getTokenDetails } from "./api.ts";
import { getMaketDataByTokenAddress } from "./agent.ts";

export const getUser = async (userId: string | null) => {
  try {
    console.log("userdata", userId);
    const response = await api.get(`/users/${userId}`);
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

export const updateUser = async (userId: string | null, data: any) => {
  try {
    console.log("userdata", userId, data);
    const response = await api.patch(`/users/${userId}`, data);

    return { ...response.data };
  } catch (error) {
    console.error("Error", error);
    throw error;
  }
};
