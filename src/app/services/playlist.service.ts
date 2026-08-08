import { inject, Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { NewPlaylist, Playlist } from "../models";
import { PlaylistApi } from "./playlist-api";
import { PlaylistEntry } from "../models/playlist-entry";

@Injectable({
  providedIn: "root", // <-- This makes the service global
})
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

  getPlaylistById(id: number): Observable<Playlist> {
    const observable = this.playlistApi.getPlaylist({
      id: id,
    });

    return observable.pipe(
      map((response: any) => {
        return response as Playlist;
      }),
    );
  }

  getEntriesForId(id: number): Observable<PlaylistEntry[]> {
    const observable = this.playlistApi.getPlaylistEntries({
      id: id,
    });

    return observable.pipe(
      map((response: any) => {
        const list = response;

        return list.map((item: any) => {
          return item as PlaylistEntry;
        });
      }),
    );
  }

  // Create a new playlist
  create(input: NewPlaylist): Observable<Playlist | undefined> {
    const observable = this.playlistApi.create(input);
    return observable.pipe(
      map((response: any) => {
        return undefined;
      }),
    );
  }
}
