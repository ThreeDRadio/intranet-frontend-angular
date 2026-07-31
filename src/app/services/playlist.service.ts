import { inject } from "@angular/core";
import { PlaylistApi } from "./playlist-api";
import { map, Observable } from "rxjs";
import { Playlist } from "../models";
import { Show } from "../models/show";

export class PlaylistService {
  readonly api = inject(PlaylistApi);

  getPlaylistPage(page: number): Observable<Playlist[]> {
    const observable = this.api.getPlaylistPage({
      page: page,
      ordering: "-date",
    });

    return observable.pipe(
      map((response: any) => {
        // Adjust 'results' based on your actual API key name (e.g., response.data, response.items)
        const list = response.results || response;

        return list.map((item: any) => {
          return item as Playlist;
        });
      }),
    );
  }
}
