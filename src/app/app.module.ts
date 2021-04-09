import { HttpClientModule } from '@angular/common/http';
import { NgModule, ErrorHandler, Directive } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule, DefaultRouterStateSerializer } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { RollbarModule, RollbarService } from 'angular-rollbar';

import { AppComponent } from './app.component';
import { COMPONENTS } from './components';
import { UploadProgressDialogComponent } from './components/upload-progress/upload-progress-dialog';
import { GUARDS } from './guards';
import { MaterialModule } from './material.module';
import { PAGES } from './pages';
import { PIPES } from './pipes';
import { API } from './services';
import { API_URL, BaseApi } from './services/base-api.service';
import { Id3Service } from './services/id3.service';
import * as Store from './store';
import { environment } from 'environments/environment';
import { NFErrorHandler, ERROR_LOGGING_SERVICE } from './services/error-handler';
import { AppRestartService } from './services/app-restart.service';
import { RestartModalComponent } from './components/restart-modal/restart-modal.component';
import { DirectivesModule } from './directives';
import { AppRoutingModule } from './app.routes';

export const errorHandler = environment.production ? NFErrorHandler : ErrorHandler;

@NgModule({
  declarations: [AppComponent, ...COMPONENTS, ...PAGES, ...PIPES],
  entryComponents: [UploadProgressDialogComponent, RestartModalComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    DirectivesModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    StoreModule.forRoot(Store.REDUCER),
    EffectsModule.forRoot(Store.EFFECTS),
    AppRoutingModule,
    StoreDevtoolsModule.instrument(),
    MaterialModule,
    StoreRouterConnectingModule.forRoot({ serializer: DefaultRouterStateSerializer }),
    RollbarModule.forRoot({
      accessToken: environment.rollbarToken
    })
  ],
  providers: [
    ...GUARDS,
    AppRestartService,
    BaseApi,
    ...API,
    Id3Service,
    {
      provide: API_URL,
      useValue: environment.api
    },
    {
      provide: ERROR_LOGGING_SERVICE,
      useClass: RollbarService
    },
    { provide: ErrorHandler, useClass: errorHandler }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
