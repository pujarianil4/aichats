import { useEnsName } from "wagmi";
import { shortenAddress } from "../../../utils/index.ts";

export default function AdminReply() {
  const { data: ensName, isLoading: isEnsNameLoading } = useEnsName({
    address: "0x79821a0F47e0c9598413b12FE4882b33326B0cF8",
  });
  return (
    <section className='admin_reply_contained'>
      <div className='admin_reply_item'>
        <div className='user_message'>
          <img
            src={`https://effigy.im/a/0x79821a0F47e0c9598413b12FE4882b33326B0cF8.svg`}
            alt={`0x79821a0F47e0c9598413b12FE4882b33326B0cF8's icon`}
            className='icon'
          />
          <div className='content'>
            <span className={`name`}>
              {!ensName
                ? shortenAddress("0x79821a0F47e0c9598413b12FE4882b33326B0cF8")
                : ensName}
              :
            </span>
            <span className='text'>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
            </span>
          </div>
        </div>
        <div className='admin_reply'>
          <img
            src={`https://effigy.im/a/0x79821a0F47e0c9598413b12FE4882b33326B0cF8.svg`}
            alt={`0x79821a0F47e0c9598413b12FE4882b33326B0cF8's icon`}
            className='icon'
          />
          <div className='content'>
            <span className={`name`}>
              {!ensName
                ? shortenAddress("0x79821a0F47e0c9598413b12FE4882b33326B0cF8")
                : ensName}
              :
            </span>
            <span className='text'>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Asperiores consequuntur veniam explicabo, mollitia magnam dolores
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
