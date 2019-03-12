import { Route } from '@angular/router';
import { LoginPageComponent } from './pages/login/login.component';

import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { MusicUploadComponent } from './pages/music-upload/music-upload.component';
import { AuthenticatedGuard } from './guards/authenticated.guard';
import { ReadyGuard } from './guards/ready.guard';
import { HomePageComponent } from './pages/home/home.component';
import { SearchComponent } from './pages/search/search.component';
import { ReleasePageComponent } from './pages/release/release.component';
import { NewReleasesPageComponent } from './pages/new-releases/new-releases.component';

export const ROUTES: Array<Route> = [
  {
    path: '',
    component: DashboardComponent,
    canActivate: [ReadyGuard, AuthenticatedGuard],
    children: [
      { path: '', component: HomePageComponent },
      { path: 'new-releases', component: NewReleasesPageComponent },
      { path: 'upload', component: MusicUploadComponent },
      { path: 'search', component: SearchComponent },
      { path: 'releases/:id', component: ReleasePageComponent }
    ]
  },
  {
    path: 'login',
    component: LoginPageComponent,
    canActivate: [ReadyGuard]
  }
];
