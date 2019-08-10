import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PageEvent, Sort } from '@angular/material';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { SupporterActions } from 'app/supporters/store/supporter/supporter.actions';
import { SupporterSelectors } from 'app/supporters/store/supporter/supporter.selectors';

@Component({
  selector: 'app-supporters-list',
  templateUrl: './supporters-list.html',
  styleUrls: ['./supporters-list.scss']
})
export class SupportersListComponent implements OnInit {
  loading$: Observable<boolean>;
  results$: Observable<Array<any>>;
  count$: Observable<number>;

  pageSizes = [10, 20, 50, 100];
  displayedColumns = ['id', 'last_name', 'first_name', 'phone_mobile', 'actions'];

  offset = 0;
  pageSize = 10;
  ordering = 'last_name';

  form = new FormGroup({
    search: new FormControl('')
  });

  search() {
    if (this.form.valid) {
      this.store.dispatch(
        new SupporterActions.RequestSearch({
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

  constructor(private store: Store<any>, private router: Router) {
    this.loading$ = this.store.select(SupporterSelectors.isLoading);
    this.results$ = this.store.select(SupporterSelectors.getAll);
    this.count$ = this.store.select(SupporterSelectors.count);
  }

  ngOnInit() {
    this.store.dispatch(new SupporterActions.Clear());
    this.store.dispatch(
      new SupporterActions.RequestSearch({
        offset: this.offset,
        limit: this.pageSize,
        ordering: this.ordering
      })
    );
  }
}
