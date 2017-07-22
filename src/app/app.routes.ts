import {Route} from '@angular/router';
import {DashboardComponent} from './pages/dashboard/dashboard.component';
import {UploadComponent} from './pages/upload/upload.component';

export const ROUTES: Array<Route> = [{
  path: '',
  component: DashboardComponent,
  children: [{path: 'upload', component: UploadComponent}]
}];
