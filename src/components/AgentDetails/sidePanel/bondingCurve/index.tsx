import "./index.scss";
import { Progress, Tooltip } from "antd";
import { BsQuestionCircle } from "react-icons/bs";

export default function BondingCurve() {
  const bonding_Percentage = 50;

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
    <>
      <div className='bonding_bx'>
        <div className='title'>
          <div className='pr_bx'>
            <p> Bonding curve ({bonding_Percentage}%)</p>
            <Tooltip
              title='when the market cap reaches $82,435 (~413.89 sol), all the liquidity in the bonding curve will be deposited to raydium and burned. progression increases as more tokens are bought.
the bonding curve still has 770.3M tokens available for sale.'
            >
              <span>
                <BsQuestionCircle color='white' />
              </span>
            </Tooltip>
          </div>

          <Progress
            percent={bonding_Percentage}
            status='active'
            showInfo={false}
            strokeColor='#FF00B7'
            className=''
          />
          <div className='msg'>
            <p>
              a raydium pool will be seeded in the next 5-20 minutes with
              $16,929 of liquidity.
            </p>
            <p>
              the link will be shared here when ready, only trust the link
              posted here.
            </p>
          </div>
        </div>
      </div>
      <div className='bonding_bx'>
        <div className='title'>
          <div className='pr_bx'>
            <p> Peak Progress ({bonding_Percentage}%)</p>
            <Tooltip
              title='when the market cap reaches $82,435 (~413.89 sol), all the liquidity in the bonding curve will be deposited to raydium and burned. progression increases as more tokens are bought.
the bonding curve still has 770.3M tokens available for sale.'
            >
              <span>
                <BsQuestionCircle color='white' />
              </span>
            </Tooltip>
          </div>

          <Progress
            percent={bonding_Percentage}
            status='active'
            showInfo={false}
            strokeColor='#4C42FF'
            className=''
          />
          <div className='msg'>
            <p>King of the Hill</p>
            {/* <p>
              the link will be shared here when ready, only trust the link
              posted here.
            </p> */}
          </div>
        </div>
      </div>

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
    </>
  );
}
