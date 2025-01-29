import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";


export interface User {
  sts: number,
  token: string,
  uid: string
  ip: string
}

interface state{
  myagents: Array<any> ,
  profile: User,
  isLoading: boolean,
  error: string
}


//TODO update Later
const initialState: state = {

  myagents: [],
  profile: {} as User,
  isLoading: false,
  error: ""

};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData: (state, action: PayloadAction<any>) => {
  
     state.profile= action.payload
     state.isLoading = false,
     state.error = ""
    },
    setMyAgents: (state, action: PayloadAction<any>) => {

     state.myagents= action.payload
     state.isLoading = false,
     state.error = ""
    },
    setUserLoading: (state) => {
      state.isLoading = true;
    },
    setUserError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
      state.profile= {} as User
    },
  },
});
console.log("initial User", initialState);
