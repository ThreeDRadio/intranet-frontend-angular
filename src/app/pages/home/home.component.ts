import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ReleaseActions } from 'app/store';
import { Observable } from 'rxjs';
import { ReleaseSelectors } from 'app/store/selectors/release.selectors';
import { Router } from '@angular/router';
import { CommentActions } from 'app/store/actions/comment.actions';
import { CommentSelectors } from 'app/store/selectors/comment.selectors';
import { Comment } from 'app/models/comment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomePageComponent implements OnInit {
  loading$: Observable<boolean>;
  releases$: Observable<Array<any>>;
  comments$: Observable<Array<Comment>>;
  count$: Observable<number>;

  displayedColumns = ['artist', 'title', 'year', 'createwhen', 'tags'];
  commentColumns = ['author', 'comment'];

  constructor(private store: Store<any>, private router: Router) {
    this.loading$ = this.store.select(ReleaseSelectors.isLoading);
    this.releases$ = this.store.select(ReleaseSelectors.getAll);
    this.comments$ = this.store.select(CommentSelectors.getAll);
    this.count$ = this.store.select(ReleaseSelectors.count);
  }

  ngOnInit() {
    this.store.dispatch(new ReleaseActions.RequestMostRecent());
    this.store.dispatch(new CommentActions.RequestMostRecent());
  }
  open(release) {
    console.log(release);
    this.router.navigate(['releases', release.id]);
  }
}
