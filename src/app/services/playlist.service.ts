import { inject, Injectable } from "@angular/core";
import { catchError, from, map, Observable, of, tap } from "rxjs";
import { NewPlaylist, Playlist } from "../models";
import { PlaylistApi } from "./playlist-api";
import { PlaylistEntry } from "../models/playlist-entry";
import { PlaylistEntryApi } from "./playlist-entry-api";

@Injectable({
  providedIn: "root",
})
export class PlaylistService {
  readonly playlistApi = inject(PlaylistApi);
  readonly playlistEntryApi = inject(PlaylistEntryApi);

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

  createPlaylist(input: NewPlaylist): Observable<Playlist> {
    const observable = this.playlistApi.create(input);
    return observable.pipe(
      map((response: any) => {
        return response as Playlist;
      }),
    );
  }

  // Entries
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

  deleteEntry(id: number): Observable<boolean> {
    const observable = this.playlistEntryApi.delete({
      id: id,
    });

    return observable.pipe(
      tap((_: any) => {
        return true;
      }),
      catchError((err, caught) => {
        return of(false);
      }),
    );
  }
}
