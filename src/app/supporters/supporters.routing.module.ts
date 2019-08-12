import { Routes, RouterModule } from '@angular/router';
import { SupportersListComponent } from './components/supporters-list/supporters-list';
import { NgModule } from '@angular/core';
import { SupporterDetailComponent } from './components/supporter-detail/supporter-detail';
import { NewSupporterComponent } from './components/new-supporter/new-supporter';
import { TransactionsComponent } from './components/transactions/transactions';

const ROUTES: Routes = [
  {
    path: '',
    component: SupportersListComponent
  },
  {
    path: 'new',
    component: NewSupporterComponent
  },
  {
    path: 'subscriptions',
    component: TransactionsComponent
  },
  {
    path: ':id',
    component: SupporterDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})
export class SupportersRoutingModule {}
