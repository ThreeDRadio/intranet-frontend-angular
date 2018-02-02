import { Route } from '@angular/router';
import { LoginPageComponent } from 'app/pages/login/login.component';

import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { UploadComponent } from './pages/upload/upload.component';

export const ROUTES: Array<Route> = [
  {
    path: '',
    component: DashboardComponent,
    children: [{ path: 'upload', component: UploadComponent }]
  },
  {
    path: 'login',
    component: LoginPageComponent
  }
];
