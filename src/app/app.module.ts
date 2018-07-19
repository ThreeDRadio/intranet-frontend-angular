import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { GUARDS } from 'app/guards';
import { PIPES } from 'app/pipes';
import { Id3Service } from 'app/services/id3.service';
import { API_URL, IntranetService } from 'app/services/intranet.service';

import { AppComponent } from './app.component';
import { ROUTES } from './app.routes';
import { COMPONENTS } from './components';
import { MaterialModule } from './material.module';
import { PAGES } from './pages';
import * as Store from './store';

@NgModule({
  declarations: [AppComponent, ...COMPONENTS, ...PAGES, ...PIPES],
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
    ...GUARDS,
    IntranetService,
    Id3Service,
    {
      provide: API_URL,
      useValue: 'http://localhost:8000'
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
