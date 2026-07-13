import { Component } from '@angular/core';
import { Store } from '@ngrx/store';

import { RequestAuthLogoutAction } from '../../store';
import { Groups } from 'app/constants';

@Component({
    // dashboard is one word. No kebab case required. GO AWAY
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    
})
export class DashboardComponent {
  public groups = Groups;

  constructor(private store: Store<any>) {}

  public logout() {
    this.store.dispatch(new RequestAuthLogoutAction());
  }
}
