import { ErrorHandler, Injectable, InjectionToken } from "@angular/core";

import { Injector } from "@angular/core";
import { AppRestartService } from "./app-restart.service";

export const ERROR_LOGGING_SERVICE = new InjectionToken<ErrorHandler>(
  "NFErrorHandler Logging Service"
);

@Injectable()
export class NFErrorHandler implements ErrorHandler {
  private errorRaised = false;
  constructor(private injector: Injector) {}

  async handleError(error) {
    try {
      const loggingService = this.injector.get(ERROR_LOGGING_SERVICE);
      if (loggingService) {
        loggingService.handleError(error);
      }
    } catch (e) {
      // injector.get throws an exception if we can't find a logging service
    }
    if (!this.errorRaised) {
      this.errorRaised = true;
      const restarter = this.injector.get(AppRestartService);
      restarter.requestRestart();
    }
  }
}
