import { useEffect, useRef } from "react";

import { store } from "./store.ts";
import { Provider } from "react-redux";
import { validateUser } from "../services/apiconfig.ts";
export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeRef = useRef<typeof store>(store);

  useEffect(() => {
    const state = storeRef.current?.getState();
    // const profile = state?.user;
    // console.log(
    //   "profile",
    //   profile,
    //   profile && Object.keys(profile).length == 0
    // );
    // Object.keys(profile).length;
    // const user = validateUser().then((user) => {});
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
