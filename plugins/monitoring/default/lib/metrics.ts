import { getCLS, getFID, getFCP, getLCP, getTTFB } from "web-vitals";
import { analytics } from "./analytics";

// Web Vitals tracking
export function reportWebVitals(metric: any) {
  const { name, value, id, delta } = metric;

  // Log to console in development
  if (process.env.NODE_ENV === "development") {
    console.log("Web Vital:", name, value);
  }

  // Send to analytics
  analytics.trackPerformance(name, value, {
    id,
    delta,
    url: typeof window !== "undefined" ? window.location.href : undefined,
  });

  // Send to external monitoring services
  if (typeof window !== "undefined" && "gtag" in window) {
    (window as any).gtag("event", name, {
      event_category: "Web Vitals",
      value: Math.round(name === "CLS" ? value * 1000 : value),
      event_label: id,
      non_interaction: true,
    });
  }
}

// Initialize Web Vitals tracking
export function initWebVitals() {
  if (typeof window === "undefined") return;

  getCLS(reportWebVitals);
  getFID(reportWebVitals);
  getFCP(reportWebVitals);
  getLCP(reportWebVitals);
  getTTFB(reportWebVitals);
}

// Custom metrics
export const metrics = {
  // Track API response times
  trackApiResponse: (endpoint: string, duration: number, status: number) => {
    analytics.trackPerformance("api_response_time", duration, {
      endpoint,
      status,
    });
  },

  // Track user interactions
  trackInteraction: (
    action: string,
    element: string,
    properties?: Record<string, any>
  ) => {
    analytics.track("user_interaction", {
      action,
      element,
      ...properties,
    });
  },

  // Track page load performance
  trackPageLoad: (url: string, loadTime: number) => {
    analytics.trackPerformance("page_load_time", loadTime, {
      url,
    });
  },

  // Track errors
  trackError: (error: Error, context?: Record<string, any>) => {
    analytics.track("error_occurred", {
      error_message: error.message,
      error_stack: error.stack,
      ...context,
    });
  },
};
