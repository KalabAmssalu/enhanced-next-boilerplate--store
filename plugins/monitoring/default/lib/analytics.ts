import { Analytics } from "@vercel/analytics/react";
import posthog from "posthog-js";

// Initialize PostHog
if (typeof window !== "undefined") {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://app.posthog.com",
    person_profiles: "identified_only",
    capture_pageview: false,
    capture_pageleave: true,
  });
}

export const analytics = {
  // Track custom events
  track: (event: string, properties?: Record<string, any>) => {
    if (typeof window !== "undefined") {
      posthog.capture(event, properties);
    }
  },

  // Identify users
  identify: (userId: string, properties?: Record<string, any>) => {
    if (typeof window !== "undefined") {
      posthog.identify(userId, properties);
    }
  },

  // Set user properties
  setUserProperties: (properties: Record<string, any>) => {
    if (typeof window !== "undefined") {
      posthog.people.set(properties);
    }
  },

  // Track page views
  trackPageView: (url?: string) => {
    if (typeof window !== "undefined") {
      posthog.capture("$pageview", {
        $current_url: url || window.location.href,
      });
    }
  },

  // Track performance metrics
  trackPerformance: (
    metric: string,
    value: number,
    properties?: Record<string, any>
  ) => {
    if (typeof window !== "undefined") {
      posthog.capture("performance_metric", {
        metric,
        value,
        ...properties,
      });
    }
  },
};

export { Analytics };
