import { Injectable } from "@angular/core";
import { TrackApi } from "app/services/track-api";
import { PlayerActions } from "../actions/player.actions";
import { Actions, ofType, Effect } from "@ngrx/effects";
import { map, switchMap, tap } from "rxjs/operators";
import { Howl, Howler } from "howler";
import { Store } from "@ngrx/store";
import { interval, Subscription } from "rxjs";

@Injectable()
export class PlayerEffects {
  private currentTrack: Howl;
  private updates: Subscription;

  @Effect()
  playTrack$ = this.actions$.pipe(
    ofType(PlayerActions.Types.RequestPlay),
    switchMap(async (action: PlayerActions.RequestPlay) => {
      const url = await this.api
        .getDownloadUrl(action.payload.track.id, "lo")
        .toPromise();
      await this.playTrack(url.url);
      return action;
    }),
    map(
      (action: PlayerActions.RequestPlay) =>
        new PlayerActions.Playing(action.payload)
    )
  );

  @Effect()
  pause$ = this.actions$.pipe(
    ofType(PlayerActions.Types.RequestPause),
    tap(() => {
      this.currentTrack.pause();
    }),
    map(() => new PlayerActions.Paused())
  );

  @Effect()
  seek$ = this.actions$.pipe(
    ofType(PlayerActions.Types.RequestSeek),
    tap((action: PlayerActions.RequestSeek) => {
      this.currentTrack.seek(action.payload);
    }),
    map(() => new PlayerActions.SeekSuccess())
  );

  @Effect()
  resume$ = this.actions$.pipe(
    ofType(PlayerActions.Types.RequestResume),
    tap(() => {
      this.currentTrack.play();
    }),
    map(() => new PlayerActions.Playing())
  );

  private playTrack(url: string) {
    return new Promise<void>((resolve, reject) => {
      if (this.currentTrack) {
        this.currentTrack.stop();
      }
      if (this.updates) {
        this.updates.unsubscribe();
      }
      this.currentTrack = new Howl({
        format: "mp3",
        src: [url],
        autoplay: true,
        html5: true,
        onplay: () => {
          resolve();
        },
        onloaderror: (id, reason) => {
          console.log(reason);
          reject(reason);
        },
        onend: () => this.emitComplete(),
      });
      this.updates = interval(1000).subscribe(() => {
        this.store.dispatch(
          new PlayerActions.UpdatePosition(this.currentTrack.seek() as number)
        );
      });
    });
  }

  private emitComplete() {
    this.store.dispatch(new PlayerActions.Completed());
    this.updates.unsubscribe();
    this.updates = null;
  }
  constructor(
    private actions$: Actions<PlayerActions.Actions>,
    private api: TrackApi,
    private store: Store<any>
  ) {}
}
