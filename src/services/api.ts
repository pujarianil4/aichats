import axios from "axios";

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
    console.log("DATA", data);
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
    const { data } = await axios.post(
      `${BASE_URL_BALANCE}/address/instance`,
      payload
    );
    return data;
  } catch (error) {
    console.log("ADD_ADDRESS_Error", error);
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
