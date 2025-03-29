
import React, { useEffect, useRef } from "react";

interface TurnstileProps {
  siteKey: string;
  onVerify: (token: string) => void;
}

export const Turnstile: React.FC<TurnstileProps> = ({ siteKey, onVerify }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<number | null>(null);
  const scriptLoadedRef = useRef<boolean>(false);

  useEffect(() => {
    // Define the renderWidget function first, before using it
    const renderWidget = () => {
      if (window.turnstile && containerRef.current && scriptLoadedRef.current) {
        // Only reset if the widget was previously rendered
        if (widgetIdRef.current !== null) {
          try {
            window.turnstile.remove(widgetIdRef.current);
            widgetIdRef.current = null;
          } catch (error) {
            console.error("Error removing Turnstile widget:", error);
          }
        }
        
        // Create a new widget
        try {
          widgetIdRef.current = window.turnstile.render(containerRef.current, {
            sitekey: siteKey,
            callback: onVerify,
            "refresh-expired": "auto",
          });
        } catch (error) {
          console.error("Error rendering Turnstile widget:", error);
        }
      } else if (!scriptLoadedRef.current || !window.turnstile) {
        // If turnstile isn't loaded yet, retry after a short delay
        setTimeout(renderWidget, 100);
      }
    };

    // Load the Turnstile script if it's not already loaded
    if (!window.turnstile) {
      const script = document.createElement("script");
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        scriptLoadedRef.current = true;
        renderWidget();
      };
      
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    } else {
      scriptLoadedRef.current = true;
      renderWidget();
    }

    return () => {
      if (widgetIdRef.current !== null && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch (error) {
          console.error("Error cleaning up Turnstile widget:", error);
        }
      }
    };
  }, [siteKey, onVerify]);

  return <div ref={containerRef} className="mt-4" />;
};
