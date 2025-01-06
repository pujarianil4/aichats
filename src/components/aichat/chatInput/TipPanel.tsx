import React from "react";
import TipButton from "./TipButton";

import "./chatinput.scss";

interface TipPanelProps {
  recipient: string;
}

export default function TipPanel({ recipient }: TipPanelProps) {
  const tipAmounts = [0.0001, 0.001, 0.1];

  return (
    <div className='tipPanel'>
      {tipAmounts.map((amount) => (
        <TipButton
          key={amount}
          tokens={amount}
          label={`${amount} Sushi`}
          recipient={recipient}
        />
      ))}
    </div>
  );
}
