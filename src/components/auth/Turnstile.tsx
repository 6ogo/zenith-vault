
import React, { useEffect, useRef, useState } from "react";

interface TurnstileProps {
  siteKey: string;
  onVerify: (token: string) => void;
  onError?: (error: Error) => void;
  onExpire?: () => void;
}

export const Turnstile: React.FC<TurnstileProps> = ({
  siteKey,
  onVerify,
  onError,
  onExpire
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | number | null>(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  // Load the Turnstile script
  useEffect(() => {
    // Check if the script is already loaded
    if (!window.turnstile && !document.getElementById("turnstile-script")) {
      const script = document.createElement("script");
      script.id = "turnstile-script";
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        setIsScriptLoaded(true);
      };
      
      document.body.appendChild(script);
      
      return () => {
        // Only remove the script if we added it
        if (document.getElementById("turnstile-script")) {
          document.body.removeChild(script);
        }
      };
    } else if (window.turnstile) {
      // If the script is already loaded, update state
      setIsScriptLoaded(true);
    }
  }, []);

  // Render the widget when the script is loaded
  useEffect(() => {
    if (!isScriptLoaded || !containerRef.current || !window.turnstile) {
      return;
    }

    // Clean up any existing widget
    if (widgetIdRef.current !== null) {
      try {
        window.turnstile.remove(widgetIdRef.current);
      } catch (error) {
        console.error("Error removing Turnstile widget:", error);
      }
      widgetIdRef.current = null;
    }
    
    // Render a new widget
    try {
      console.log("Rendering Turnstile widget with sitekey:", siteKey);
      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        callback: (token: string) => {
          console.log("Turnstile verification successful");
          onVerify(token);
        },
        "error-callback": (errorCode: string) => {
          console.error("Turnstile verification failed:", errorCode);
          onError?.(new Error(`Turnstile verification failed: ${errorCode}`));
        },
        "expired-callback": () => {
          console.warn("Turnstile token expired");
          onExpire?.();
        },
        theme: "light",
        size: "normal",
      });
      console.log("Turnstile widget ID:", widgetIdRef.current);
    } catch (error) {
      console.error("Error rendering Turnstile widget:", error);
      onError?.(error instanceof Error ? error : new Error(String(error)));
    }

    // Clean up the widget when the component unmounts
    return () => {
      if (widgetIdRef.current !== null && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch (error) {
          console.error("Error cleaning up Turnstile widget:", error);
        }
      }
    };
  }, [isScriptLoaded, siteKey, onVerify, onError, onExpire]);

  return <div ref={containerRef} className="mt-4" data-testid="turnstile-container" />;
};
