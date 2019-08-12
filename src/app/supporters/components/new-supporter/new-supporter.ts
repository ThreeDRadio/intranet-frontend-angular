import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { SupporterActions } from 'app/supporters/store/supporter/supporter.actions';

@Component({
  selector: 'app-new-supporter',
  templateUrl: './new-supporter.html',
  styleUrls: ['./new-supporter.scss']
})
export class NewSupporterComponent {
  constructor(private store: Store<any>) {}

  create(value) {
    this.store.dispatch(new SupporterActions.RequestCreate(value));
  }
}
