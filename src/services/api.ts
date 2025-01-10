import axios from "axios";

const BASE_URL = "https://balance-servie.onrender.com";
const BASE_URL1 = "https://jsonplaceholder.typicode.com";
export const getMessages = async (page: number, limit = 20) => {
  // setIsLoading(true);
  try {
    const { data } = await axios.get(
      `${BASE_URL1}/posts?_page=${page}&_limit=${limit}`
    );
    // const response = await fetch(
    //   `${BASE_URL1}/posts?_page=${page}&_limit=${limit}`
    // );
    // const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const addAddress = async (address: string) => {
  const body = {
    address: address,
    sts: "online",
  };
  try {
    const { data } = await axios.post(`${BASE_URL}/address`, body);
    return data;
  } catch (error) {
    console.log("ADD_ADDRESS_Error", error);
    throw error;
  }
};
