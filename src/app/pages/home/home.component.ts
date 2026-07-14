import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ReleaseActions } from 'app/store';
import { Observable } from 'rxjs';
import { ReleaseSelectors } from 'app/store/selectors/release.selectors';
import { Router, RouterLink } from '@angular/router';
import { CommentActions } from 'app/store/actions/comment.actions';
import { CommentSelectors } from 'app/store/selectors/comment.selectors';
import { Comment } from 'app/models/comment';
import { AsyncPipe, DatePipe } from '@angular/common';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow } from '@angular/material/table';
import { MatSort, MatSortHeader } from '@angular/material/sort';
import { MatChipListbox, MatChipOption } from '@angular/material/chips';
import { MatIcon } from '@angular/material/icon';
import { CommentListComponent } from '../../components/comment-list/comment-list.component';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    imports: [MatProgressBar, MatTable, MatSort, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatSortHeader, MatCellDef, MatCell, MatChipListbox, MatChipOption, MatIcon, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow, RouterLink, CommentListComponent, AsyncPipe, DatePipe]
})
export class HomePageComponent implements OnInit {
  loading$: Observable<boolean>;
  releases$: Observable<Array<any>>;
  comments$: Observable<Array<Comment>>;
  count$: Observable<number>;

  displayedColumns = ['artist', 'title', 'year', 'createwhen', 'tags'];

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
    this.router.navigate(['releases', release.id]);
  }
}
