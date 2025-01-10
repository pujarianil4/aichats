import React, { useEffect } from "react";
import "./index.scss";
import TokenInfo from "./tokeninfo/tokeninfo.tsx";
import SidePanel from "./sidePanel/SidePanel.tsx";
import { getTokenDetails } from "../../services/api.ts";

export const TokenDetails = () => {
  const [tokenDetails, setTokenDetails] = React.useState(null);

  const getToken = async () => {
    const data = await getTokenDetails(
      "0x0202be363b8a4820f3f4de7faf5224ff05943ab1"
    );

    setTokenDetails(data);
    console.log("Data", data);
  };

  useEffect(() => {
    getToken();
  }, []);
  return (
    <div className='tokendetails_container'>
      {tokenDetails && (
        <>
          {" "}
          <TokenInfo tokenDetails={tokenDetails} />
          <SidePanel tokenDetails={tokenDetails} />{" "}
        </>
      )}
    </div>
  );
};
