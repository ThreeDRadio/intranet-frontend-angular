import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { ReleaseActions } from 'app/store';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { ReleaseSelectors } from 'app/store/selectors/release.selectors';

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

  displayedColumns = ['artist', 'title', 'year', 'tags'];

  search() {
    if (this.form.valid) {
      this.store.dispatch(new ReleaseActions.RequestSearch(this.form.value));
    }
  }
  constructor(private store: Store<any>) {
    this.loading$ = this.store.select(ReleaseSelectors.isLoading);
    this.results$ = this.store.select(ReleaseSelectors.getAll);
    this.count$ = this.store.select(ReleaseSelectors.count);
  }
}
