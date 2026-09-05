import { inject, Injectable } from "@angular/core";
import { catchError, from, map, Observable, of, tap, throwError } from "rxjs";
import { NewPlaylist, Playlist } from "../models";
import { PlaylistApi } from "./playlist-api";
import { PlaylistEntry } from "../models/playlist-entry";
import { PlaylistEntryApi } from "./playlist-entry-api";
import { ApiModel } from "./model-api";

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

  completePlaylist(id: number): Observable<boolean> {
    const reducedPayload = { id: id, complete: true };
    const fakeApiModel: ApiModel = reducedPayload;
    return this.playlistApi.partialUpdate(fakeApiModel).pipe(
      tap((_: any) => {
        return true;
      }),
      catchError((err, caught) => {
        return of(false);
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

  createEntry(input: PlaylistEntry): Observable<PlaylistEntry> {
    return this.playlistEntryApi.create(input).pipe(
      map((response: any) => {
        return response as PlaylistEntry;
      }),
      catchError((err, caught) => {
        return throwError(() => err);
      }),
    );
  }

  updateEntry(input: PlaylistEntry): Observable<PlaylistEntry> {
    return this.playlistEntryApi.partialUpdate(input).pipe(
      map((response) => {
        return response as PlaylistEntry;
      }),
      catchError((err, caught) => {
        return throwError(() => err);
      }),
    );
  }

  reorderEntries(entries: PlaylistEntry[]) {
    const observable = this.playlistEntryApi.reorderEntries(entries);

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
