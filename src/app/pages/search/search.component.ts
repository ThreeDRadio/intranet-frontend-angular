import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { ReleaseActions } from 'app/store';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { ReleaseSelectors } from 'app/store/selectors/release.selectors';
import { PageEvent, Sort } from '@angular/material';

@Component({
  selector: 'app-catalogue-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {
  form = new FormGroup({
    search: new FormControl('', Validators.required)
  });

  loading$: Observable<boolean>;
  results$: Observable<Array<any>>;
  count$: Observable<number>;

  displayedColumns = ['artist', 'title', 'year', 'createwhen', 'tags'];

  pageSizes = [10, 20, 50, 100];

  offset = 0;
  pageSize = 10;
  ordering = '-createwhen';

  search() {
    if (this.form.valid) {
      this.store.dispatch(
        new ReleaseActions.RequestSearch({
          ...this.form.value,
          offset: this.offset,
          limit: this.pageSize,
          ordering: this.ordering
        })
      );
    }
  }

  open(release) {
    console.log(release);
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
  constructor(private store: Store<any>) {
    this.loading$ = this.store.select(ReleaseSelectors.isLoading);
    this.results$ = this.store.select(ReleaseSelectors.getAll);
    this.count$ = this.store.select(ReleaseSelectors.count);
  }
}
