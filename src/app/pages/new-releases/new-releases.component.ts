import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { PageEvent } from '@angular/material';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { ReleaseSelectors } from 'app/store/selectors/release.selectors';
import { ReleaseActions } from 'app/store';

import * as moment from 'moment-timezone';

@Component({
  selector: 'app-new-releases',
  templateUrl: './new-releases.component.html'
})
export class NewReleasesPageComponent implements OnInit {
  loading$: Observable<boolean>;
  results$: Observable<Array<any>>;
  count$: Observable<number>;

  pageSizes = [10, 20, 50, 100];
  offset = 0;
  pageSize = 10;
  ordering = '-createwhen';

  paginationChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.offset = event.pageIndex * this.pageSize;
    this.search();
  }

  search() {
    this.store.dispatch(
      new ReleaseActions.RequestSearch({
        min_arrival: moment()
          .subtract(2, 'months')
          .format('YYYY-MM-DD'),
        offset: this.offset,
        limit: this.pageSize,
        ordering: this.ordering
      })
    );
  }

  open(release) {
    this.router.navigate(['releases', release.id]);
  }

  constructor(private store: Store<any>, private router: Router) {
    this.loading$ = this.store.select(ReleaseSelectors.isLoading);
    this.results$ = this.store.select(ReleaseSelectors.getAll);
    this.count$ = this.store.select(ReleaseSelectors.count);
  }

  ngOnInit() {
    this.store.dispatch(new ReleaseActions.Clear());
    this.search();
  }
}
