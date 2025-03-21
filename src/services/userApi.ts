import { Address } from "viem";
import { api } from "./apiconfig.ts";
import { getTokenDetails } from "./api.ts";
import { getMaketDataByTokenAddress } from "./agent.ts";

export const getUser = async (userId: string | null) => {
  try {
    console.log("userdata", userId);
    const response = await api.get(`/users/${userId}`);

    return { ...response.data };
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

export const checkUserExist = async (username: string) => {
  try {
    const response = await api.get(`/users/${username}`);
    return response.data;
  } catch (error) {
    console.error("Error checking username:", error);
    return { available: false };
  }
};

export const handleSocialCallback = async (data: any) => {
  try {
    console.log("userdata", data);
    const response = await api.post(`/users/verifyToken`, data);

    return { ...response.data };
  } catch (error) {
    console.error("Error verifying Twitter auth:", error);
    return { success: false };
  }
};
