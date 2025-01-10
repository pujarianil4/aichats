// import { parseUnits } from "viem";
// import { erc20Abi } from "../contracts/abi.ts";
// import { useWriteContract } from "wagmi";

// export async function sendTip({
//   amount,
//   recipient,
//   contractAddress,
//   writeContract,
//   isConnected,
// }: {
//   amount: string;
//   recipient: string;
//   contractAddress: string;
//   writeContract: any;
//   isConnected: boolean;
// }) {
//   if (!isConnected) {
//     alert("Please connect your wallet");
//     return;
//   }

//   if (!amount || parseFloat(amount) <= 0) {
//     alert("Please enter a valid amount");
//     return;
//   }

//   try {
//     // Send the transaction
//     const tx = await writeContract({
//       address: contractAddress,
//       abi: erc20Abi,
//       functionName: "transfer",
//       args: [recipient, parseUnits(amount, 18)],
//     });

//     return tx.hash; // Return the transaction hash
//   } catch (err: any) {
//     alert(err.message || "Transaction submission failed");
//   }
// }
