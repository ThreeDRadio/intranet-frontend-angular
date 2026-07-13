import {
  enableProdMode,
  ErrorHandler,
  importProvidersFrom,
} from "@angular/core";

import * as Sentry from "@sentry/angular";

import { environment } from "environments/environment";
import { GUARDS } from "./app/guards";
import { AppRestartService } from "./app/services/app-restart.service";
import { BaseApi, API_URL } from "./app/services/base-api.service";
import { API } from "./app/services";
import { Id3Service } from "./app/services/id3.service";
import { errorHandler } from "./app/app.module";
import { ERROR_LOGGING_SERVICE } from "./app/services/error-handler";
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from "@angular/common/http";
import { BrowserModule, bootstrapApplication } from "@angular/platform-browser";
import { provideAnimations } from "@angular/platform-browser/animations";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Store, StoreModule } from "@ngrx/store";
import { EffectsModule } from "@ngrx/effects";
import { AppRoutingModule } from "./app/app.routes";
import { StoreDevtoolsModule } from "@ngrx/store-devtools";
import { MaterialModule } from "./app/material.module";
import {
  StoreRouterConnectingModule,
  FullRouterStateSerializer,
} from "@ngrx/router-store";
import { AppComponent } from "./app/app.component";

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
    importProvidersFrom(
      BrowserModule,
      FormsModule,
      ReactiveFormsModule,
      StoreModule.forRoot({}), //Store.REDUCER
      EffectsModule.forRoot({}), //Store.EFFECTS
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
