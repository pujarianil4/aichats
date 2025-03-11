import { userSlice } from "./user.ts";

export const { setUserData, setUserError, setUserLoading , setClearHistory} = userSlice.actions;


export const userReducer = userSlice.reducer;

