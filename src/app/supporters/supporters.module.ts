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
import { SupporterFormComponent } from './components/supporter-form/supporter-form';
import { TransactionApi } from './services/transaction.api';
import { TransactionEffects } from './store/transaction/transaction.effects';
import { TransactionTableComponent } from './components/transaction-table/transaction-table';
import { ToastEffects } from './store/toast.effects';
import { NewSupporterComponent } from './components/new-supporter/new-supporter';
import { NewSubscriptionComponent } from './components/new-subscription/new-subscription';
import { TransactionsComponent } from './components/transactions/transactions';

@NgModule({
  declarations: [
    NewSubscriptionComponent,
    NewSupporterComponent,
    SupportersListComponent,
    SupporterDetailComponent,
    SupporterFormComponent,
    TransactionsComponent,
    TransactionTableComponent
  ],
  entryComponents: [NewSubscriptionComponent],
  exports: [SupportersListComponent],
  providers: [SupporterApi, TransactionApi],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    EffectsModule.forFeature([SupporterEffects, TransactionEffects, ToastEffects]),
    StoreModule.forFeature('supporters', REDUCER),
    SupportersRoutingModule
  ]
})
export class SupportersModule {}
