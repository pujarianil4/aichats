import React, { useEffect, useRef, useState } from "react";
import "./index.scss";
declare global {
  interface Window {
    twttr?: {
      widgets: {
        load: (element?: HTMLElement | null) => void;
      };
    };
  }
}

const TwitterFeed: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const account_Url = "https://twitter.com/UniLend_Finance";
  useEffect(() => {
    const twitterScriptId = "twitter-wjs";
    if (!document.getElementById(twitterScriptId)) {
      const script = document.createElement("script");
      script.id = twitterScriptId;
      script.src = "https://platform.twitter.com/widgets.js";
      script.async = true;
      script.charset = "utf-8";
      document.body.appendChild(script);
      script.onload = () => setIsLoading(false);
    } else {
      window.twttr?.widgets.load(containerRef.current);
      setIsLoading(false);
    }
  }, []);

  return (
    <div className='twitter-feed-wrapper'>
      {isLoading && <div className='loader'>Loading tweets...</div>}
      <div className='twitter-feed-container' ref={containerRef}>
        <a
          className='twitter-timeline'
          data-width='100%'
          data-theme='dark'
          href={account_Url}
          data-chrome='noscrollbar noborders transparent'
          data-tweet-limit='5'
          data-aria-polite='assertive'
        ></a>
      </div>
    </div>
  );
};

export default TwitterFeed;
