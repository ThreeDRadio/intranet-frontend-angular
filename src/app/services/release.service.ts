import { inject, Injectable } from "@angular/core";
import { EMPTY, map, Observable } from "rxjs";
import { ReleaseApi } from "./release-api";
import { Track } from "../models/track";
import { Release } from "../models/release";

@Injectable({
  providedIn: "root",
})
export class ReleaseService {
  readonly releaseApi = inject(ReleaseApi);

  quickSearch(search: string, limit: number, offset: number) {
    return this.releaseApi.simpleSearch({
      search,
      limit,
      offset,
      ordering: "-createwhen",
    });
  }

  getRelease(id: number): Observable<Release> {
    return this.releaseApi.get(id);
  }

  getTracklist(id: number): Observable<Track[]> {
    const observable = this.releaseApi.tracks(id);

    return observable.pipe(
      map((response: any) => {
        const list = response;

        return list.map((item: any) => {
          return item as Track;
        });
      }),
    );
  }
}
