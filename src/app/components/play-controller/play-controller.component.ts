import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { PlayerStatus } from 'app/store/reducers/player.reducer';
import { Track } from 'app/models';
import { PlayerSelectors } from 'app/store/selectors/player.selectors';
import { PlayerActions } from 'app/store/actions/player.actions';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-play-controller',
  templateUrl: './play-controller.component.html',
  styleUrls: ['./play-controller.component.scss']
})
export class PlayControllerComponent {
  status$: Observable<PlayerStatus>;
  track$: Observable<Track>;
  position$: Observable<number>;

  visible = false;

  LOADING = PlayerStatus.LOADING;
  PLAYING = PlayerStatus.PLAYING;
  PAUSED = PlayerStatus.PAUSED;
  IDLE = PlayerStatus.IDLE;

  pause() {
    this.store.dispatch(new PlayerActions.RequestPause());
  }
  resume() {
    this.store.dispatch(new PlayerActions.RequestResume());
  }
  seek(sliderEvent) {
    this.store.dispatch(new PlayerActions.RequestSeek(sliderEvent.value));
  }
  constructor(private store: Store<any>) {
    this.status$ = this.store.select(PlayerSelectors.playerStatus);
    this.track$ = this.store.select(PlayerSelectors.currentTrack);
    this.position$ = this.store.select(PlayerSelectors.trackPosition);

    // hide the player until the first time playing
    this.status$.pipe(take(1)).subscribe(() => {
      this.visible = true;
    });
  }
}
