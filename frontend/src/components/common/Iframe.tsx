import React, { useRef, useState } from "react";

interface RawHtmlIframeProps {
  html: string;
  title?: string;
  width?: string | number;
}

export const RawHtmlIframe: React.FC<RawHtmlIframeProps> = ({
  html,
  title = "Embedded Content",
  width = "100%",
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(0);

  const handleLoad = () => {
    const body = iframeRef.current?.contentDocument?.body;
    if (body) {
      setHeight(body.scrollHeight);
    }
  };

  return (
    <iframe
      ref={iframeRef}
      title={title}
      srcDoc={html}
      width={width}
      height={height}
      onLoad={handleLoad}
      style={{ border: "none", display: "block" }}
    />
  );
};

export default RawHtmlIframe;
