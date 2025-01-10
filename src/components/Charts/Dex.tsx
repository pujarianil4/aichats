import { useEffect, useRef, useState } from "react";
import "./index.scss";
function DextoolsWidget() {
  const [iframeStatus, setIframeStatus] = useState("loading");

  const handleIframeLoad = () => {
    setIframeStatus("loaded");
  };

  const handleIframeError = () => {
    setIframeStatus("error");
  };

  return (
    <div className='chart_container'>
      <iframe
        src='https://www.dextools.io/widget-chart/en/ether/pe-light/0x6384b1e35ee28662e7460ceab10eb3d6a265792b?theme=light&chartType=1&chartResolution=30&drawingToolbars=false'
        id='dextools-widget'
        title='DEXTools Trading Chart'
        width='500'
        height='400'
        frameBorder='0'
        onLoad={handleIframeLoad}
        onError={handleIframeError}
      />
      <div>
        {iframeStatus === "loading" && <p>Loading iframe...</p>}
        {iframeStatus === "loaded" && <p>Iframe loaded successfully!</p>}
        {iframeStatus === "error" && <p>Failed to load iframe.</p>}
      </div>
    </div>
  );
}

export default DextoolsWidget;
