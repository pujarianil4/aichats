import React, { useState } from "react";
import uftLogo from "../../../assets/uftLogo.svg";
import { FaChevronDown } from "react-icons/fa6";
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
  const tipAmount = [10, 100, 1000];
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");

  async function handleTip(amount: string) {
    if (!isConnected) return alert("Please connect your wallet");
    if (!amount || parseFloat(amount) <= 0) {
      return alert("Please enter a valid amount");
    }
    try {
      await writeContract({
        address: sushiTokenAddress,
        abi: erc20Abi,
        functionName: "transfer",
        args: [recipient, parseUnits(amount, 18)],
      });
    } catch (err: any) {
      alert(err.message || "Transaction submission failed");
    }
  }

  const handleButtonClick = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount("");
    handleTip(amount.toString());
  };

  const handleCustomTip = () => {
    handleTip(customAmount);
  };

  return (
    <>
      <div className='tipPanel'>
        {tipAmount.map((amount) => (
          <div key={amount} className='tip_bx'>
            <img
              src={uftLogo}
              alt='Token Logo'
              className='user-message__icon'
            />
            <span
              onClick={() => handleButtonClick(amount)}
              disabled={isPending || isConfirming}
            >
              {amount.toLocaleString()}k
            </span>
          </div>
        ))}
      </div>

      <div className='token_input'>
        <input
          type='number'
          className='input_text'
          placeholder='Enter Amount'
          value={customAmount}
          onChange={(e) => {
            setCustomAmount(e.target.value);
            setSelectedAmount(null); // Clear selected button if custom input is used
          }}
        />

        <div className='selectToken'>
          <img src={uftLogo} alt='Token Logo' className='user-message__icon' />
          <span>UFT</span>
          <FaChevronDown />
        </div>
        <span className='send_btn' onClick={handleCustomTip}>
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
