import React from "react";

import "./index.scss";

type Props = {
  tokenDetails: any;
};

const DeveloperTab = ({ tokenDetails }: Props) => {
  return (
    <div className='developer_profile'>
      <h2>Developer</h2>

      <div className='info'>
        <div className='img'></div>
        <p>07654ewertyuio98765435678987654</p>
      </div>
      <div className='social'>
        <p>View Profile</p>
      </div>
    </div>
  );
};

export default DeveloperTab;
