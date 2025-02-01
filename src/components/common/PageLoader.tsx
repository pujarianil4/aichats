import React from "react";
import { Spin } from "antd";
export default function PageLoader() {
  const contentStyle: React.CSSProperties = {
    padding: 50,
    background: "rgba(0, 0, 0, 0.05)",
    borderRadius: 4,
  };

  const content = <div style={contentStyle} />;
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "80vh",
      }}
    >
      {" "}
      <Spin tip='Loading...' size='large'>
        {content}
      </Spin>
    </div>
  );
}
