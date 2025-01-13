import { shortenAddress } from "../userMessage/index.tsx";
import "./index.scss";

interface UserMessageProps {
  ensName: string;
  data: any;
}

export default function SuerChatMessage({ ensName, data }: UserMessageProps) {
  return (
    <>
      <div className='super_container'>
        <img
          src={`https://effigy.im/a/${data.senderAddress}.svg`}
          alt={`${data.senderAddress}'s icon`}
          className='user-message__icon'
        />
        <div className='admin__content'>
          <span className='admin__name'>
            {ensName ? ensName : shortenAddress(data.senderAddress)}:
          </span>
          <span className='admin__value'> ${data.amnt} </span>
          <div className='admin__text'>{data.content}</div>
        </div>
      </div>
    </>
  );
}
