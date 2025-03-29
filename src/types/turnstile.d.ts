
interface TurnstileInstance {
  render: (container: HTMLElement, options: TurnstileOptions) => string | number;
  reset: (widgetId: string | number) => void;
  remove: (widgetId: string | number) => void;
  getResponse: (widgetId: string | number) => string | undefined;
}

interface TurnstileOptions {
  sitekey: string;
  callback?: (token: string) => void;
  "expired-callback"?: () => void;
  "error-callback"?: (errorCode: string) => void;
  "timeout-callback"?: () => void;
  "challenge-text-callback"?: (text: string) => void;
  "challenge-completed-callback"?: (reason: string) => void;
  "refresh-expired"?: "auto" | "manual";
  theme?: "light" | "dark" | "auto";
  tabindex?: number;
  size?: "normal" | "compact";
  appearance?: "always" | "execute" | "interaction-only";
  language?: string;
  retry?: "auto" | "never";
  "retry-interval"?: number;
  "refresh-interval"?: number;
}

declare global {
  interface Window {
    turnstile: TurnstileInstance;
  }
}

export {};
