import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { TransactionActions } from 'app/supporters/store/transaction/transaction.actions';
import { TransactionSelectors } from 'app/supporters/store/transaction/transaction.selectors';
import { PageEvent, Sort } from '@angular/material';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.html',
  styleUrls: ['./transactions.scss']
})
export class TransactionsComponent implements OnInit {
  form = new FormGroup({
    search: new FormControl(''),
    shipping: new FormControl(''),
    pack_sent: new FormControl(false),
    payment_processed: new FormControl(true)
  });

  loading$: Observable<boolean>;
  results$: Observable<Array<any>>;
  count$: Observable<number>;

  pageSizes = [10, 20, 50, 100];

  offset = 0;
  pageSize = 10;
  ordering = '-created_at';

  constructor(private store: Store<any>) {
    this.loading$ = this.store.select(TransactionSelectors.isLoading);
    this.results$ = this.store.select(TransactionSelectors.getAll);
    this.count$ = this.store.select(TransactionSelectors.count);
  }

  search() {
    if (this.form.valid) {
      this.store.dispatch(
        new TransactionActions.RequestSearch({
          ...this.form.value,
          offset: this.offset,
          limit: this.pageSize,
          ordering: this.ordering
        })
      );
    }
  }

  paginationChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.offset = event.pageIndex * this.pageSize;
    this.search();
  }

  sort(event: Sort) {
    console.log(event);
    this.ordering = (event.direction === 'asc' ? '' : '-') + event.active;
    this.search();
  }

  ngOnInit() {
    this.store.dispatch(new TransactionActions.Clear());
    this.store.dispatch(
      new TransactionActions.RequestSearch({
        offset: this.offset,
        limit: this.pageSize,
        ordering: this.ordering,
        ...this.form.value
      })
    );
  }
}
