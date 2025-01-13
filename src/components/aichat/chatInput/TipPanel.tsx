import React, { useEffect, useState } from "react";
import uftLogo from "../../../assets/uftLogo.svg";
import "./chatinput.scss";

interface TipPopupProps {
  customAmount: string;
  setCustomAmount: (value: string) => void;
}

const TipPopup: React.FC<TipPopupProps> = ({
  customAmount,
  setCustomAmount,
}) => {
  const [tipAmount, setTipAmount] = useState<string[]>(["10", "100", "1000"]);
  const [isChecked, setIsChecked] = useState<boolean>(false);

  // Load saved values from localStorage
  useEffect(() => {
    const savedAmounts = localStorage.getItem("savedTipAmounts");
    if (savedAmounts) {
      const parsedAmounts = JSON.parse(savedAmounts);
      if (parsedAmounts.length > 0) {
        setTipAmount(parsedAmounts);
        setIsChecked(true);
      }
    }
  }, []);

  const handleSaveAmount = () => {
    if (customAmount.trim() !== "") {
      const savedAmounts = JSON.parse(
        localStorage.getItem("savedTipAmounts") || "[]"
      );

      let updatedTipAmount = [...tipAmount];

      if (savedAmounts.length === 0) {
        updatedTipAmount[0] = customAmount;
        savedAmounts.push(customAmount);
      } else if (savedAmounts.length === 1) {
        updatedTipAmount[1] = customAmount;
        savedAmounts[1] = customAmount;
      } else if (savedAmounts.length === 2) {
        updatedTipAmount[2] = customAmount;
        savedAmounts[2] = customAmount;
      } else if (savedAmounts.length >= 3) {
        updatedTipAmount[2] = customAmount;
        savedAmounts[2] = customAmount;
      }

      localStorage.setItem("savedTipAmounts", JSON.stringify(savedAmounts));
      setTipAmount(updatedTipAmount);
      setIsChecked(true);
    }
  };

  const handleTipClick = (amount: string) => {
    setCustomAmount(amount);
  };

  return (
    <div className='tip-popup'>
      <div className='tipPanel'>
        {tipAmount.map((amount, index) => (
          <div key={index} className='tip_bx'>
            <img
              src={uftLogo}
              alt='Token Logo'
              className='user-message__icon'
            />
            <span onClick={() => handleTipClick(amount)}>{amount}</span>
          </div>
        ))}
      </div>
      <div className='token_input'>
        <input
          type='number'
          className='input_text'
          placeholder='Enter Amount'
          value={customAmount}
          onChange={(e) => setCustomAmount(e.target.value)}
        />
      </div>
      <div
        className='save-checkbox'
        onClick={() => {
          handleSaveAmount();
        }}
      >
        <input
          type='checkbox'
          checked={isChecked}
          onChange={() => setIsChecked(!isChecked)}
        />
        <span> Save this Amount</span>
      </div>
    </div>
  );
};

export default TipPopup;
