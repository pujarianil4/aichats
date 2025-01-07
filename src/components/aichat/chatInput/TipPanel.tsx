import React, { useState } from "react";
import TipButton from "./TipButton.tsx";
import uftLogo from "../../../assets/uftLogo.svg";
import "./chatinput.scss";
import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useAccount,
} from "wagmi";
import { parseUnits } from "viem";
import { erc20Abi } from "../../../helpers/contracts/abi.ts";
interface TipPanelProps {
  recipient: string;
}

export default function TipPanel({ recipient }: TipPanelProps) {
  const tipAmounts = [100, 1000, 10000];

  const { isConnected } = useAccount();

  const {
    data: hash,
    error: writeError,
    isPending,
    writeContract,
  } = useWriteContract();
  const sushiTokenAddress = "0x0b3F868E0BE5597D5DB7fEB59E1CADBb0fdDa50a";

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    error: receiptError,
  } = useWaitForTransactionReceipt({
    hash,
  });

  async function handleTip() {
    if (!isConnected) return alert("please connect your wallet");
    try {
      await writeContract({
        address: sushiTokenAddress,
        abi: erc20Abi,
        functionName: "transfer",
        args: [recipient, parseUnits("10", 18)],
      });
    } catch (err: any) {
      onError(err.message || "Transaction submission failed"); // Handle write errors
    }
  }

  const [message, setMessage] = useState("");
  return (
    <>
      <div className='tipPanel'>
        <div className='tip_bx'>
          <img src={uftLogo} alt='token Logo' className='user-message__icon' />
          <span
            onClick={handleTip}
            disabled={isPending || isConfirming}
            type='submit'
          >
            100k
          </span>
        </div>
        <div className='tip_bx'>
          <img src={uftLogo} alt='token Logo' className='user-message__icon' />
          <span
            onClick={handleTip}
            disabled={isPending || isConfirming}
            type='submit'
          >
            100k
          </span>
        </div>
        <div className='tip_bx'>
          <img src={uftLogo} alt='token Logo' className='user-message__icon' />
          <span
            onClick={handleTip}
            disabled={isPending || isConfirming}
            type='submit'
          >
            100k
          </span>
        </div>
      </div>

      <div className='token_input'>
        <input
          type='number'
          className='input_text'
          placeholder='Enter Amount'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <span className='send_btn'>
          <svg
            width='16'
            height='15'
            viewBox='0 0 16 15'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
            className='send-icon'
          >
            <path
              d='M14.3419 7.64462L0.95119 14.092L3.43095 7.64462L0.95119 1.19725L14.3419 7.64462Z'
              stroke='white'
              strokeWidth='1.40276'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
        </span>
      </div>
    </>
  );
}
