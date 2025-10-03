import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
  debug: false,
  integrations: [
    Sentry.httpIntegration(),
    Sentry.expressIntegration(),
    Sentry.nodeContextIntegration(),
  ],
  beforeSend(event, hint) {
    // Filter out non-error events in development
    if (process.env.NODE_ENV === "development" && event.level !== "error") {
      return null;
    }
    return event;
  },
});
