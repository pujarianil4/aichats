import React from "react";
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
  const tipAmount = [10, 100, 1000];

  return (
    <div className='tip-popup'>
      <div className='tipPanel'>
        {tipAmount.map((amount) => (
          <div key={amount} className='tip_bx'>
            <img
              src={uftLogo}
              alt='Token Logo'
              className='user-message__icon'
            />
            <span onClick={() => setCustomAmount(amount.toString())}>
              {amount.toLocaleString()}
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
          onChange={(e) => setCustomAmount(e.target.value)}
        />
      </div>
    </div>
  );
};

export default TipPopup;
