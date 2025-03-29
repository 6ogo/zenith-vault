
import React, { useEffect, useRef, useState } from "react";

interface TurnstileProps {
  siteKey: string;
  onVerify: (token: string) => void;
  onError?: (error: Error) => void;
}

export const Turnstile: React.FC<TurnstileProps> = ({ siteKey, onVerify, onError }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<number | null>(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState<boolean>(false);

  // Load the Turnstile script once on component mount
  useEffect(() => {
    // Only load the script if it's not already loaded
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
        const scriptElement = document.getElementById("turnstile-script");
        if (scriptElement) {
          document.body.removeChild(scriptElement);
        }
      };
    } else if (window.turnstile) {
      // If the script is already loaded, update state
      setIsScriptLoaded(true);
    }
  }, []);

  // Handle widget rendering once the script is loaded
  useEffect(() => {
    if (!isScriptLoaded || !containerRef.current) {
      return;
    }

    // Reset previous widget if it exists
    if (widgetIdRef.current !== null && window.turnstile) {
      try {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      } catch (error) {
        console.error("Error removing Turnstile widget:", error);
        onError?.(error instanceof Error ? error : new Error(String(error)));
      }
    }
    
    // Create a new widget
    try {
      console.log("Rendering Turnstile widget with sitekey:", siteKey);
      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        callback: (token: string) => {
          console.log("Turnstile verification successful, token received");
          onVerify(token);
        },
        "error-callback": () => {
          console.error("Turnstile verification failed");
          onError?.(new Error("Turnstile verification failed"));
        },
        "expired-callback": () => {
          console.warn("Turnstile token expired");
          onError?.(new Error("Turnstile token expired"));
        },
        theme: "light",
        size: "normal",
      });
      console.log("Turnstile widget ID:", widgetIdRef.current);
    } catch (error) {
      console.error("Error rendering Turnstile widget:", error);
      onError?.(error instanceof Error ? error : new Error(String(error)));
    }

    // Cleanup on unmount
    return () => {
      if (widgetIdRef.current !== null && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch (error) {
          console.error("Error cleaning up Turnstile widget:", error);
        }
      }
    };
  }, [isScriptLoaded, siteKey, onVerify, onError]);

  return <div ref={containerRef} className="mt-4" data-testid="turnstile-container" />;
};
