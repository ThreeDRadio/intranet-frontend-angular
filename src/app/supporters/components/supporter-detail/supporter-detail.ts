import { Component } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import { SupporterActions } from 'app/supporters/store/supporter/supporter.actions';
import { SupporterSelectors } from 'app/supporters/store/supporter/supporter.selectors';
import { map } from 'rxjs/operators';
import { FormGroup, FormControl } from '@angular/forms';
import { TransactionActions } from 'app/supporters/store/transaction/transaction.actions';
import { Transaction } from 'app/supporters/models/transaction';
import { TransactionSelectors } from 'app/supporters/store/transaction/transaction.selectors';

@Component({
  selector: 'app-supporter-detail',
  templateUrl: './supporter-detail.html',
  styleUrls: ['./supporter-detail.scss']
})
export class SupporterDetailComponent {
  supporter$: Observable<any>;
  notes$: Observable<Array<any>>;
  transactions$: Observable<Array<Transaction>>;

  supporterId: number;

  constructor(private store: Store<any>, private route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      this.supporterId = params.id;
      this.store.dispatch(new SupporterActions.RequestById(params.id));
      this.store.dispatch(new TransactionActions.RequestForSupporter({ supporterId: params.id }));

      this.supporter$ = this.store
        .select(SupporterSelectors.getEntities)
        .pipe(map(entities => entities[params.id]));

      this.transactions$ = this.store.select(
        TransactionSelectors.transactionsForSupporter(params.id)
      );
    });
  }

  saveSupporter(value) {
    this.store.dispatch(
      new SupporterActions.RequestUpdate({
        supporterId: this.supporterId,
        payload: value
      })
    );
  }
}
