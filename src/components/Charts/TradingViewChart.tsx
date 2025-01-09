import { useEffect, useRef, memo } from "react";
import "./tradingview.scss";

function TradingViewWidget() {
  const container = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const existingScript = document.getElementById("tradingview-widget-script");

    if (!existingScript) {
      const script = document.createElement("script");
      script.src =
        "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
      script.type = "text/javascript";
      script.async = true;
      script.id = "tradingview-widget-script"; // Set an ID for the script
      script.innerHTML = `
        {
          "autosize": true,
          "symbol": "CRYPTOCAP:USDT",
          "interval": "D",
          "timezone": "Etc/UTC",
          "theme": "light",
          "style": "1",
          "locale": "en",
          "backgroundColor": "rgba(255, 255, 255, 1)",
          "withdateranges": true,
          "allow_symbol_change": true,
          "details": true,
          "calendar": false,
          "hide_volume": true,
          "support_host": "https://www.tradingview.com"
        }`;

      container.current?.appendChild(script);
    }

    return () => {
      const script = document.getElementById("tradingview-widget-script");
      if (script) {
        script.remove();
      }
    };
  }, []);

  return (
    <div className='tradingview_container'>
      <div
        className='tradingview-widget-container'
        ref={container}
        style={{ height: "100%", width: "100%" }}
      >
        <div
          className='tradingview-widget-container__widget'
          style={{ height: "calc(100% - 32px)", width: "100%" }}
        ></div>
      </div>
    </div>
  );
}

export default memo(TradingViewWidget);
