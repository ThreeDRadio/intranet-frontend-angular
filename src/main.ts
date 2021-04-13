import { enableProdMode } from "@angular/core";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";

import * as Sentry from "@sentry/angular";
import { Integrations } from "@sentry/tracing";

import { AppModule } from "app/app.module";
import { environment } from "environments/environment";

Sentry.init({
  dsn:
    "https://f972382f58e44de9b3468f7c896e10d5@o120815.ingest.sentry.io/5712655",
  integrations: [
    // Registers and configures the Tracing integration,
    // which automatically instruments your application to monitor its
    // performance, including custom Angular routing instrumentation
    new Integrations.BrowserTracing({
      tracingOrigins: ["localhost", "https://intranet.threedradio.com/backend"],
      routingInstrumentation: Sentry.routingInstrumentation,
    }),
  ],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule);
