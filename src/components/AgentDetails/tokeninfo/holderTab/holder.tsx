import React from "react";
import "./index.scss";

type Props = {
  tokenDetails: any;
};

const Holder = ({ tokenDetails }: Props) => {
  const holderData = [
    { name: "J6fBQt", percentage: 20.69 },
    { name: "FVQwSr", percentage: 9.52 },
    { name: "FGDHoY", percentage: 7.37 },
    { name: "J28kPL", percentage: 5.0 },
    { name: "8CWL1f", percentage: 4.95 },
    { name: "G3yTma", percentage: 4.16 },
    { name: "AzeGD7", percentage: 3.29 },
    { name: "Uy3N4F", percentage: 2.83 },
  ];

  return (
    <div className='address_bx'>
      <div className='title'>
        <div className='pr_bx'>
          <p>Holders Distribution</p>
        </div>
        <div className='holder-distribution'>
          <div className='header'>
            <span>Holders</span>
            <span>Percentage</span>
          </div>
          <div className='list'>
            {holderData.map((item, index) => (
              <div key={index} className='item'>
                <span>{item.name}</span>
                <span>{item.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Holder;
