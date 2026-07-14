import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ReleaseSelectors } from 'app/store/selectors/release.selectors';
import { map } from 'rxjs/operators';
import { ReleaseActions } from 'app/store';
import { TrackActions } from 'app/store/actions/track.actions';
import { TrackSelectors } from 'app/store/selectors/track.selectors';
import { CommentActions } from 'app/store/actions/comment.actions';
import { Comment } from 'app/models/comment';
import { CommentSelectors } from 'app/store/selectors/comment.selectors';
import { PlayerActions } from 'app/store/actions/player.actions';
import { AsyncPipe } from '@angular/common';
import { MatChipSet, MatChip, MatChipAvatar } from '@angular/material/chips';
import { MatIcon } from '@angular/material/icon';
import { MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow } from '@angular/material/table';
import { MatButton } from '@angular/material/button';
import { CommentListComponent } from '../../components/comment-list/comment-list.component';
import { DurationPipe } from '../../pipes/duration.pipe';

@Component({
    selector: 'app-release',
    templateUrl: './release.component.html',
    styleUrls: ['./release.component.scss'],
    imports: [MatChipSet, MatChip, MatIcon, MatChipAvatar, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatButton, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow, CommentListComponent, AsyncPipe, DurationPipe]
})
export class ReleasePageComponent {
  release$: Observable<any>;
  tracks$: Observable<Array<any>>;
  comments$: Observable<Array<Comment>>;

  trackColumns = ['tracknum', 'trackartist', 'tracktitle', 'tracklength', 'actions'];

  constructor(private store: Store<any>, private route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      this.store.dispatch(new ReleaseActions.RequestById(params.id));
      this.store.dispatch(new TrackActions.RequestForRelease({ releaseId: params.id }));
      this.store.dispatch(new CommentActions.RequestForRelease({ releaseId: params.id }));

      this.release$ = this.store
        .select(ReleaseSelectors.getEntities)
        .pipe(map(entities => entities[params.id]));

      this.tracks$ = this.store.select(TrackSelectors.tracksForRelease(params.id));
      this.comments$ = this.store.select(CommentSelectors.commentsForRelease(params.id));
    });
  }

  download(element) {
    this.store.dispatch(new TrackActions.RequestDownload({ id: element.id }));
  }

  play(element) {
    this.store.dispatch(new PlayerActions.RequestPlay({ track: element }));
  }
}
