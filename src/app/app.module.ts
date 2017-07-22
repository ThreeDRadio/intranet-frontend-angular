import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {MaterialModule} from '@angular/material';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterModule} from '@angular/router';
import {EffectsModule} from '@ngrx/effects';
import {StoreRouterConnectingModule} from '@ngrx/router-store';
import {StoreModule} from '@ngrx/store';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';

import {AppComponent} from './app.component';
import {ROUTES} from './app.routes';
import {ComponentsModule} from './components';
import {COMPONENTS} from './pages';
import * as Store from './store';

@NgModule({
  declarations: [AppComponent, ...COMPONENTS],
  imports: [
    BrowserModule, BrowserAnimationsModule, FormsModule, HttpModule,
    StoreModule.forRoot(Store.REDUCERS), EffectsModule.forRoot(Store.EFFECTS),
    RouterModule.forRoot(ROUTES), StoreDevtoolsModule.instrument(),
    ComponentsModule, MaterialModule, StoreRouterConnectingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
