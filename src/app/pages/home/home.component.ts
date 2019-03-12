import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ReleaseActions } from 'app/store';
import { Observable } from 'rxjs';
import { ReleaseSelectors } from 'app/store/selectors/release.selectors';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomePageComponent implements OnInit {
  loading$: Observable<boolean>;
  results$: Observable<Array<any>>;
  count$: Observable<number>;

  displayedColumns = ['artist', 'title', 'year', 'createwhen', 'tags'];

  constructor(private store: Store<any>, private router: Router) {
    this.loading$ = this.store.select(ReleaseSelectors.isLoading);
    this.results$ = this.store.select(ReleaseSelectors.getAll);
    this.count$ = this.store.select(ReleaseSelectors.count);
  }

  ngOnInit() {
    this.store.dispatch(new ReleaseActions.RequestMostRecent());
  }
  open(release) {
    console.log(release);
    this.router.navigate(['releases', release.id]);
  }
}
