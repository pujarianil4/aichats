import { api } from "./apiconfig.ts";

export const handleAuthConnect = async (payload: {
  sig: `0x${string}` | string | undefined;
  msg: string;
   typ: string
}) => {
  const response = await api.post("/auth/connect", payload);

  console.log("LOGIN_RES", response);
  // setToLocalStorage("userSession", response.data);
  return response.data;
};

export const handleAuthDisconnect = async () => {
  try {
    const response = await api.patch("/auth/disconnect");
    return response.data;
  } catch (error) {
    throw error;
  }
};