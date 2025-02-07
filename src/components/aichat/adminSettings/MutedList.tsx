import { Tooltip } from "antd";
import { IoMdCheckmark, IoMdCopy } from "react-icons/io";
import "./index.scss";
import { formatTimeDifference, shortenAddress } from "../../../utils/index.ts";
import socket from "../../../services/socket.ts";
import NotificationMessage from "../../common/notificationMessage.tsx";

const MutedList = ({
  listData,
  copiedIndex,
  setCopiedIndex,
  instanceData,
}: any) => {
  const copyToClipboard = (address: string, index: number) => {
    navigator.clipboard.writeText(address).then(() => {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    });
  };

  const handleUnmute = (address: string) => {
    console.log("MUTED");
    socket.emit(
      "unmuteUser",
      {
        walletAddress: address,
        instanceId: instanceData?.id,
      },
      (response: any) => {
        console.log("RES", response);
        if (response.success) {
          listData?.filter((item: any) => item != address);
          console.log("Before filter:", listData);
          let listData1 = listData?.filter((item: any) => item !== address);
          console.log("After filter:", listData1);
        } else {
          console.error("Failed to unmute:", response.error);
          NotificationMessage("error", response.error.message);
        }
      }
    );
  };

  {
    /* {listData?.length == 0 && (
        <div className='noUserFound'>
          <img src={noUserFound} alt='No chat found' loading='lazy' />
        </div>
      )} */
  }

  return (
    <div className='listItems'>
      <h4>Muted ({listData?.length})</h4>
      {listData?.map((item: any, index: number) => (
        <div className='listItem' key={index}>
          <img
            src={`https://effigy.im/a/${item?.address}.svg`}
            alt={`icon`}
            className='userIcon'
          />
          <div>
            <div className='address'>
              <p>{shortenAddress(item?.address)}</p>
              <Tooltip
                placement='top'
                title={copiedIndex === index ? "Copied!" : "Copy Address"}
              >
                {copiedIndex === index ? (
                  <IoMdCheckmark size={16} className='copyIcon checked' />
                ) : (
                  <IoMdCopy
                    style={{ cursor: "pointer" }}
                    size={16}
                    onClick={() => copyToClipboard(item?.address, index)}
                    className='copyIcon'
                  />
                )}
              </Tooltip>
            </div>
            <p className='muteTime'>
              Muted: {formatTimeDifference(item?.mutedAt)}{" "}
            </p>
          </div>
          <button onClick={() => handleUnmute(item?.address)}>Unmute</button>
        </div>
      ))}
    </div>
  );
};

export default MutedList;
