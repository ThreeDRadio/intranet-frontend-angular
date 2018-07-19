import { Component } from '@angular/core';
import { Store } from '@ngrx/store';

import { RequestAuthLogoutAction } from '../../store';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  constructor(private store: Store<any>) {}

  public logout() {
    this.store.dispatch(new RequestAuthLogoutAction());
  }
}
