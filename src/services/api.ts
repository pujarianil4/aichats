// export async function getTokenDetails(tokenAddress : string) {
//   const url =
//     `https://api.coingecko.com/api/v3/coins/ethereum/contract/${tokenAddress}`;
//     const timeStampUrl = `https://api.etherscan.io/v2/api?chainid=1&module=contract&action=getcontractcreation&contractaddresses=${tokenAddress}&apikey=IIQF1RE4TP86VDXC27Z9CYMS3GKZQYXYK1`;

//   try {
//     const response = await fetch(url);
//     const timeResponse = await fetch(timeStampUrl)
//     const createdAt = await  timeResponse.json()
//     const data = await response.json();
//     console.log("Token Details:", data);
//  return {...data, contract_creation: createdAt.result[0]};

//   } catch (error: any) {
//     console.error(
//       "Error fetching token details:",
//       error.response?.data || error.message
//     );
//   }
// }


export async function getTokenDetails(tokenAddress: string) {

  const eth_key = import.meta.env.VITE_ETHERSCAN_API_KEY
  const apiUrl = `https://api.coingecko.com/api/v3/coins/ethereum/contract/${tokenAddress}`;
  const creationUrl = `https://api.etherscan.io/v2/api?chainid=1&module=contract&action=getcontractcreation&contractaddresses=${tokenAddress}&apikey=${eth_key}`;

  try {
    const [tokenResponse, creationResponse] = await Promise.all([
      fetch(apiUrl),
      fetch(creationUrl)
    ]);

    if (!tokenResponse.ok || !creationResponse.ok) {
      throw new Error('Failed to fetch data from one or both APIs');
    }

    const tokenData = await tokenResponse.json();
    const creationData = await creationResponse.json();

    console.log("Token Details:", tokenData);

    return {
      ...tokenData,
      contract_creation: creationData.result?.[0] || null
    };
  } catch (error: any) {
    console.error("Error fetching token details:", error.message || error);
    throw error;
  }
}
