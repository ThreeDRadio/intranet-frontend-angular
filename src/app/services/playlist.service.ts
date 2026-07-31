import { inject } from "@angular/core";
import { map, Observable } from "rxjs";
import { Playlist } from "../models";
import { PlaylistApi } from "./playlist-api";

export class PlaylistService {
  readonly playlistApi = inject(PlaylistApi);

  getPlaylistPage(page: number): Observable<Playlist[]> {
    const observable = this.playlistApi.getPlaylistPage({
      page: page,
      ordering: "-date",
    });

    return observable.pipe(
      map((response: any) => {
        const list = response.results || response;

        return list.map((item: any) => {
          return item as Playlist;
        });
      }),
    );
  }
}
