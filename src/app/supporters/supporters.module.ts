import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { REDUCER } from './store';
import { SupportersListComponent } from './components';
import { SupportersRoutingModule } from './supporters.routing.module';
import { SupporterApi } from './services/supporter.api';
import { EffectsModule } from '@ngrx/effects';
import { SupporterEffects } from './store/supporter/supporter.effects';
import { MaterialModule } from 'app/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SupporterDetailComponent } from './components/supporter-detail/supporter-detail';

@NgModule({
  declarations: [SupportersListComponent, SupporterDetailComponent],
  exports: [SupportersListComponent],
  providers: [SupporterApi],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    EffectsModule.forFeature([SupporterEffects]),
    StoreModule.forFeature('supporters', REDUCER),
    SupportersRoutingModule
  ]
})
export class SupportersModule {}
