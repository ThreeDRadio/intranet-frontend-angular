import {
  enableProdMode,
  ErrorHandler,
  importProvidersFrom,
  provideZoneChangeDetection
} from "@angular/core";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";

import * as Sentry from "@sentry/angular";

import { environment } from "environments/environment";
import { GUARDS } from "./app/guards";
import { AppRestartService } from "./app/services/app-restart.service";
import { BaseApi, API_URL } from "./app/services/base-api.service";
import { API } from "./app/services";
import { Id3Service } from "./app/services/id3.service";
import { errorHandler } from "./app/app.module";
import {
  NFErrorHandler,
  ERROR_LOGGING_SERVICE,
} from "./app/services/error-handler";
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from "@angular/common/http";
import { BrowserModule, bootstrapApplication } from "@angular/platform-browser";
import { provideAnimations } from "@angular/platform-browser/animations";
import { DirectivesModule } from "./app/directives";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { StoreModule } from "@ngrx/store";
import { EffectsModule } from "@ngrx/effects";
import { AppRoutingModule } from "./app/app.routes";
import { StoreDevtoolsModule } from "@ngrx/store-devtools";
import { MaterialModule } from "./app/material.module";
import {
  StoreRouterConnectingModule,
  FullRouterStateSerializer,
} from "@ngrx/router-store";
import { COMPONENTS } from "./app/components";
import { PAGES } from "./app/pages";
import { PIPES } from "./app/pipes";
import { AppComponent } from "./app/app.component";
import { EFFECTS, REDUCER } from "app/store";

Sentry.init({
  dsn: "https://f972382f58e44de9b3468f7c896e10d5@o120815.ingest.sentry.io/5712655",
  integrations: [
    // Registers and configures the Tracing integration,
    // which automatically instruments your application to monitor its
    // performance, including custom Angular routing instrumentation
    Sentry.browserTracingIntegration,
  ],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection(),importProvidersFrom(
      BrowserModule,
      DirectivesModule,
      FormsModule,
      ReactiveFormsModule,
      StoreModule.forRoot(REDUCER),
      EffectsModule.forRoot(EFFECTS),
      AppRoutingModule,
      StoreDevtoolsModule.instrument({ connectInZone: true }),
      MaterialModule,
      StoreRouterConnectingModule.forRoot({
        serializer: FullRouterStateSerializer,
      }),
    ),
    ...GUARDS,
    AppRestartService,
    BaseApi,
    ...API,
    Id3Service,
    {
      provide: API_URL,
      useValue: environment.api,
    },
    {
      provide: ERROR_LOGGING_SERVICE,
      useValue: Sentry.createErrorHandler({ showDialog: true }),
    },
    { provide: ErrorHandler, useClass: errorHandler },
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimations(),
  ],
});
