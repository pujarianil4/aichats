import { useEnsAvatar, useEnsName } from "wagmi";
import SuerChatMessage from "../superChat/index.tsx";
import { normalize } from "viem/ens";
import "./index.scss";

interface UserMessageProps {
  data: any;
}

export const shortenAddress = (address: string) =>
  address && `${address.slice(0, 5)}....${address.slice(address.length - 5)}`;

export default function UserMessage({ data }: UserMessageProps) {
  const { data: ensName, isLoading: isEnsNameLoading } = useEnsName({
    address: data.senderAddress,
  });

  return (
    <>
      {data?.amnt ? (
        // <div className='admin'>
        //   <img
        //     src={userIcon}
        //     alt={`${data.senderAddress}'s icon`}
        //     className='user-message__icon'
        //   />
        //   <div className='admin__content'>
        //     <span className='admin__name'>
        //       {shortenAddress(data.senderAddress)}:
        //     </span>
        //     <span className='admin__value'> ${data.amnt} </span>
        //     <div className='admin__text'>{data.content}</div>
        //   </div>
        // </div>
        <SuerChatMessage ensName={ensName} data={data} />
      ) : (
        <div className='user-message'>
          <img
            src={`https://effigy.im/a/${data.senderAddress}.svg`}
            alt={`${data.senderAddress}'s icon`}
            className='user-message__icon'
          />
          <div className='user-message__content'>
            <span className='user-message__name'>
              {!ensName ? shortenAddress(data.senderAddress) : ensName}:
            </span>
            <span className='user-message__text'>{data.content}</span>
          </div>
        </div>
      )}
    </>
  );
}
