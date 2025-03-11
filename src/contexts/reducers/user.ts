import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface User {
  sts: number | null;
  token: string | null;
  uId: string | null;
  isLogedIn: "yes" | "no" | null;
  ip: string | null;
}

interface ICurrentAgent{
  clearHistory: boolean
}

interface state {
  myagents: Array<any>;
  profile: User;
  isLoading: boolean;
  error: string;
  currentAgent: ICurrentAgent
}

//TODO update Later
const initialState: state = {
  myagents: [],
  profile: {
    isLogedIn: "no",
  } as User,
  isLoading: false,
  error: "",
  currentAgent: {} as ICurrentAgent
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData: (state, action: PayloadAction<any>) => {
      state.profile = action.payload;
      (state.isLoading = false), (state.error = "");
    },
    setMyAgents: (state, action: PayloadAction<any>) => {
      state.myagents = action.payload;
      state.isLoading = false;
       state.error = "";
    },
    setUserLoading: (state) => {
      state.isLoading = true;
    },
    setUserError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
      state.profile = {
        token: null,
        sts: null,
        uId: null,
        ip: null,
        isLogedIn: "no",
      } as User;
    },
    setClearHistory: (state, action: PayloadAction<any>) => {
      state.currentAgent.clearHistory = action.payload;
     
    },
  },
});
