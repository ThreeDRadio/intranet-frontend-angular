import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from './material.module';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { IntranetService, API_URL } from 'app/services/intranet.service';

import { AppComponent } from './app.component';
import { ROUTES } from './app.routes';
import { COMPONENTS } from './components';
import { PAGES } from './pages';
import * as Store from './store';

@NgModule({
  declarations: [AppComponent, ...COMPONENTS, ...PAGES],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    StoreModule.forRoot(Store.REDUCER),
    EffectsModule.forRoot(Store.EFFECTS),
    RouterModule.forRoot(ROUTES),
    StoreDevtoolsModule.instrument(),
    MaterialModule,
    StoreRouterConnectingModule
  ],
  providers: [
    IntranetService,
    {
      provide: API_URL,
      useValue: 'https://intranet.threedradio.com/logger/backend/api'
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
