// import { useAccount, useSendTransaction } from "wagmi";
// import { parseEther } from "viem";
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
//   const { sendTransaction } = useSendTransaction();
//   const { isConnected } = useAccount();
//   const handleTip = async () => {
//     if (!isConnected) return alert("please connect to wallet");

//     try {
//       const value = parseEther(tokens.toString());
//       const result = await sendTransaction({
//         to: recipient,
//         value,
//       });
//       console.log(`Transaction sent: ${tokens} tokens`, result);
//     } catch (error) {
//       console.error("Error sending tokens:", error);
//     }
//   };

//   return (
//     <button onClick={handleTip} className='tipButton'>
//       {label}
//     </button>
//   );
// }

import {
  useSimulateContract,
  useWriteContract,
  useTransactionConfirmations,
  useAccount,
} from "wagmi";
import { parseUnits } from "viem";
import { erc20Abi } from "../../../helpers/contracts/abi.ts";
interface TipButtonProps {
  tokens: number;
  label: string;
  recipient: string;
}

export default function TipButton({
  tokens,
  label,
  recipient,
}: TipButtonProps) {
  const sushiTokenAddress = "0x0b3F868E0BE5597D5DB7fEB59E1CADBb0fdDa50a";
  const { isConnected } = useAccount();
  const { data, isError, isLoading } = useSimulateContract({
    address: sushiTokenAddress,
    abi: erc20Abi,
    functionName: "transfer",
    args: [recipient, parseUnits(tokens.toString(), 18)],
  });

  // Write contract
  const { writeContract } = useWriteContract();

  const handleTip = () => {
    if (!isConnected) return alert("please connect your wallet");
    if (!data?.request) {
      console.error("Transaction simulation failed");
      return;
    }
    writeContract(data.request);
  };

  return (
    <button onClick={handleTip} className='tipButton' disabled={isLoading}>
      {isLoading ? "Processing..." : label}
    </button>
  );
}
