import { Route } from '@angular/router';
import { LoginPageComponent } from 'app/pages/login/login.component';

import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { UploadComponent } from './pages/upload/upload.component';
import { AuthenticatedGuard } from 'app/guards/authenticated.guard';
import { ReadyGuard } from 'app/guards/ready.guard';
import { HomePageComponent } from 'app/pages/home/home.component';

export const ROUTES: Array<Route> = [
  {
    path: '',
    component: DashboardComponent,
    canActivate: [ReadyGuard, AuthenticatedGuard],
    children: [
      { path: '', component: HomePageComponent },
      { path: 'upload', component: UploadComponent }
    ]
  },
  {
    path: 'login',
    component: LoginPageComponent,
    canActivate: [ReadyGuard]
  }
];
