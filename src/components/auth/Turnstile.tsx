
import React, { useEffect, useRef } from "react";

interface TurnstileProps {
  siteKey: string;
  onVerify: (token: string) => void;
}

export const Turnstile: React.FC<TurnstileProps> = ({ siteKey, onVerify }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<number | null>(null);

  useEffect(() => {
    // Load the Turnstile script if it's not already loaded
    if (!window.turnstile) {
      const script = document.createElement("script");
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    }

    // Wait for turnstile to be available
    const renderWidget = () => {
      if (window.turnstile && containerRef.current) {
        if (widgetIdRef.current !== null) {
          window.turnstile.reset(widgetIdRef.current);
        } else {
          widgetIdRef.current = window.turnstile.render(containerRef.current, {
            sitekey: siteKey,
            callback: onVerify,
            "refresh-expired": "auto",
          });
        }
      } else {
        // If turnstile isn't loaded yet, retry after a short delay
        setTimeout(renderWidget, 100);
      }
    };

    renderWidget();

    return () => {
      if (widgetIdRef.current !== null && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
      }
    };
  }, [siteKey, onVerify]);

  return <div ref={containerRef} className="mt-4" />;
};
