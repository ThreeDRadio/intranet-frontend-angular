import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ReleaseSelectors } from 'app/store/selectors/release.selectors';
import { map } from 'rxjs/operators';
import { ReleaseActions } from 'app/store';
import { TrackActions } from 'app/store/actions/track.actions';
import { TrackSelectors } from 'app/store/selectors/track.selectors';

@Component({
  selector: 'app-release',
  templateUrl: './release.component.html',
  styleUrls: ['./release.component.scss']
})
export class ReleasePageComponent {
  release$: Observable<any>;
  tracks$: Observable<Array<any>>;

  trackColumns = ['tracknum', 'trackartist', 'tracktitle', 'tracklength', 'actions'];

  constructor(private store: Store<any>, private route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      this.store.dispatch(new ReleaseActions.RequestById(params.id));
      this.store.dispatch(new TrackActions.RequestTracksForRelease({ releaseId: params.id }));
      this.release$ = this.store
        .select(ReleaseSelectors.getEntities)
        .pipe(map(entities => entities[params.id]));

      this.tracks$ = this.store.select(TrackSelectors.tracksForRelease(params.id));
    });
  }

  download(element) {
    this.store.dispatch(new TrackActions.RequestDownload({ id: element.id }));
  }
}
