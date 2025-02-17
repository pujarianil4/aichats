import { useState, useMemo } from "react";
import { Select, Button } from "antd";

import { parseUnits } from "viem";
import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useAccount,
} from "wagmi";
import starterPic from "/src/assets/starter.svg";
import mediumPic from "/src/assets/medium.svg";
import advancedPic from "/src/assets/advance.svg";
import "./index.scss";
const { Option } = Select;
import { erc20Abi } from "../../../../helpers/contracts/abi.ts";
const CREDIT_PACKAGES = [
  { name: "Starter", price: 20, credits: 1000, imgLink: starterPic },
  { name: "Medium", price: 100, credits: 7000, imgLink: mediumPic },
  { name: "Advanced", price: 500, credits: 50000, imgLink: advancedPic },
];

const CreditPurchaseModal = ({ visible: any }) => {
  const { address } = useAccount();
  const [selectedPackage, setSelectedPackage] = useState(CREDIT_PACKAGES[0]);
  const [selectedToken, setSelectedToken] = useState("ETH");
  const { data: hash, isPending, writeContract } = useWriteContract();
  const adjustedCredits = useMemo(() => {
    return selectedToken === "UFT"
      ? Math.floor(selectedPackage.credits * 1.2)
      : selectedPackage.credits;
  }, [selectedToken, selectedPackage]);

  const adminAddress = "0xfEA4Ff6Ce70b9AE6Dd77FdeE8aaF090827710a24";
  const ethAddress = "0x4200000000000000000000000000000000000006";
  const handleSend = async () => {
    if (address)
      if (selectedPackage.price) {
        await writeContract({
          address: ethAddress as `0x${string}`,
          abi: erc20Abi,
          functionName: "transfer",
          args: [
            adminAddress,
            parseUnits(selectedPackage.price.toString(), 18),
          ],
        });
      }
  };

  return (
    <>
      <h3> Your Agent runs on Credits</h3>
      <div className='credit-grid'>
        {CREDIT_PACKAGES.map((pkg) => (
          <div
            key={pkg.name}
            className={`credit-card ${
              selectedPackage.name === pkg.name
                ? "selected gradient-border "
                : ""
            }`}
            onClick={() => setSelectedPackage(pkg)}
          >
            <h1>{pkg.name}</h1>
            <img src={pkg?.imgLink} alt='credit pack img' />
            <p>Price: ${pkg.price}</p>
            <p>Credits: {pkg.credits}</p>
          </div>
        ))}
      </div>

      <div className='payMore'> Pay in $UFT and Get 20% more Credit</div>
      <div className='token-selection'>
        <label>Select Token</label>
        <Select
          value={selectedToken}
          onChange={setSelectedToken}
          className='select-box'
        >
          <Option value='ETH'>ETH</Option>
          <Option value='SOL'>SOL</Option>
          <Option value='UFT'>UFT (20% Bonus)</Option>
        </Select>
      </div>

      {/* <p className='final-credits'>Final Credits: {adjustedCredits}</p> */}

      <button
        type='primary'
        className='pay-button gradient-border'
        onClick={() => handleSend()}
        // loading={isLoading}
        disabled={!address}
      >
        Pay {selectedPackage.price} {selectedToken}
      </button>
    </>
  );
};

export default CreditPurchaseModal;
