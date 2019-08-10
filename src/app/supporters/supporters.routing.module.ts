import { Routes, RouterModule } from '@angular/router';
import { SupportersListComponent } from './components/supporters-list/supporters-list';
import { NgModule } from '@angular/core';
import { SupporterDetailComponent } from './components/supporter-detail/supporter-detail';

const ROUTES: Routes = [
  {
    path: '',
    component: SupportersListComponent
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
