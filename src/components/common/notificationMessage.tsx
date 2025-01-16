import { notification } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import "./index.scss";

export default function NotificationMessage(result: string, msg: string) {
  return notification.open({
    mesage: { result },
    description: result === "success" ? msg : msg,
    onClick: () => {},
    className: "notification_class",
    closeIcon: false,
    duration: 5,
    icon:
      result == "success" ? (
        <CheckCircleOutlined style={{ color: "green" }} />
      ) : (
        <CloseCircleOutlined style={{ color: "red" }} />
      ),
  });
}
