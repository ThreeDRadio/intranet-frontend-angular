import { Component } from '@angular/core';
import { Store } from '@ngrx/store';

import { RequestAuthLogoutAction } from '../../store';
import { Groups } from 'app/constants';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  public groups = Groups;

  constructor(private store: Store<any>) {}

  public logout() {
    this.store.dispatch(new RequestAuthLogoutAction());
  }
}
