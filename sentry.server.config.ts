// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://c2f87f4af4f0d46e4e98ca2c5be038e5@o4508228859658240.ingest.de.sentry.io/4508393954017360",

  // Disable sentry in development environment
  enabled: (process.env.NODE_ENV !== "development"),

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 1,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
});
