
interface TurnstileInstance {
  render: (container: HTMLElement, options: TurnstileOptions) => number;
  reset: (widgetId: number) => void;
  remove: (widgetId: number) => void;
  getResponse: (widgetId: number) => string | undefined;
}

interface TurnstileOptions {
  sitekey: string;
  callback?: (token: string) => void;
  "expired-callback"?: () => void;
  "error-callback"?: () => void;
  "refresh-expired"?: "auto" | "manual";
  theme?: "light" | "dark" | "auto";
  tabindex?: number;
  size?: "normal" | "compact";
  appearance?: "always" | "execute" | "interaction-only";
}

declare global {
  interface Window {
    turnstile: TurnstileInstance;
  }
}

export {};
