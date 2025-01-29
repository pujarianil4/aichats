import { userSlice } from "./user.ts";

export const { setUserData, setUserError, setUserLoading } = userSlice.actions;


export const userReducer = userSlice.reducer;

