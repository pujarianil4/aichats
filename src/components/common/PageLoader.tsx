import React from "react";
import Lottie from "react-lottie";
import { Spin } from "antd";
import loader from "../../assets/loader.json";
export default function PageLoader() {
  const contentStyle: React.CSSProperties = {
    padding: 50,
    background: "rgba(0, 0, 0, 0.05)",
    borderRadius: 4,
  };

  const defaultOptionsLotti = {
    loop: true,
    autoplay: true,
    animationData: loader,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
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
      {/* <Spin tip='Loading...' size='large'>
        {content}
      </Spin> */}
      <Lottie options={defaultOptionsLotti} height={300} width={300} />
    </div>
  );
}
