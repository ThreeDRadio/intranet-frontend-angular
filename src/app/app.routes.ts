import { Route } from '@angular/router';
import { LoginPageComponent } from './pages/login/login.component';

import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { MusicUploadComponent } from './pages/music-upload/music-upload.component';
import { AuthenticatedGuard } from './guards/authenticated.guard';
import { ReadyGuard } from './guards/ready.guard';
import { HomePageComponent } from './pages/home/home.component';

export const ROUTES: Array<Route> = [
  {
    path: '',
    component: DashboardComponent,
    canActivate: [ReadyGuard, AuthenticatedGuard],
    children: [
      { path: '', component: HomePageComponent },
      { path: 'upload', component: MusicUploadComponent }
    ]
  },
  {
    path: 'login',
    component: LoginPageComponent,
    canActivate: [ReadyGuard]
  }
];
