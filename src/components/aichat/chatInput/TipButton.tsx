// import React, { useState } from "react";
// import {
//   useWriteContract,
//   useWaitForTransactionReceipt,
//   useAccount,
// } from "wagmi";
// import { parseUnits } from "viem";
// import { erc20Abi } from "../../../helpers/contracts/abi.ts";
// import "./chatinput.scss";
// interface TipButtonProps {
//   tokens: number;
//   label: string;
//   recipient: string;
// }

// export default function TipButton({
//   tokens,
//   label,
//   recipient,
// }: TipButtonProps) {
//   const { isConnected } = useAccount();

//   const {
//     data: hash,
//     error: writeError,
//     isPending,
//     writeContract,
//   } = useWriteContract();
//   const sushiTokenAddress = "0x0b3F868E0BE5597D5DB7fEB59E1CADBb0fdDa50a";

//   const {
//     isLoading: isConfirming,
//     isSuccess: isConfirmed,
//     error: receiptError,
//   } = useWaitForTransactionReceipt({
//     hash,
//   });

//   async function handleTip() {
//     if (!isConnected) return alert("please connect your wallet");
//     try {
//       await writeContract({
//         address: sushiTokenAddress,
//         abi: erc20Abi,
//         functionName: "transfer",
//         args: [recipient, parseUnits(tokens.toString(), 18)],
//       });
//     } catch (err: any) {
//       onError(err.message || "Transaction submission failed"); // Handle write errors
//     }
//   }

//   return (
//     <>
//       <div className='tip_bx'>
//         <img
//           src='https://via.placeholder.com/40'
//           alt='token Logo'
//           className='user-message__icon'
//         />
//         <span
//           onClick={handleTip}
//           disabled={isPending || isConfirming}
//           type='submit'
//         >
//           {isPending ? "Confirming..." : label}
//         </span>
//       </div>
//     </>
//   );
// }
