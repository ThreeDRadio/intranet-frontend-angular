import { inject, Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { Show } from "../models/show";
import { ShowApi } from "./show-api";

export type TopArtist = {
  artist: string;
  plays: number;
};

export type Statistic = {
  name: string;
  value: number;
  target: number;
};

@Injectable({
  providedIn: "root", // <-- This makes the service global
})
export class ShowService {
  readonly showApi = inject(ShowApi);

  getShow(id: number): Observable<Show> {
    const observable = this.showApi.getShows({ ids: [id] });

    return observable.pipe(
      map((response: any) => {
        const list = response;
        return list[0] as Show;
      }),
    );
  }

  getShows(ids: number[]): Observable<Show[]> {
    const observable = this.showApi.getShows({ ids: ids });

    return observable.pipe(
      map((response: any) => {
        const list = response;

        return list.map((item: any) => {
          return item as Show;
        });
      }),
    );
  }

  getAllShows() {
    const observable = this.showApi.getAllShows();

    return observable.pipe(
      map((response: any) => {
        const list = response;

        return list.map((item: any) => {
          return item as Show;
        });
      }),
    );
  }

  getStats(showId: number): Observable<Statistic[]> {
    return this.showApi.getStatistics(showId).pipe(
      map((response) => {
        return response.map((item) => {
          return item as Statistic;
        });
      }),
    );
  }

  getTopArtists(showId: number): Observable<TopArtist[]> {
    return this.showApi.getTopArtists(showId).pipe(
      map((response) => {
        return response.map((item) => {
          return item as TopArtist;
        });
      }),
    );
  }

  filter(input: string, shows: Show[]) {
    const query = (typeof input === "string" ? input : "").toLowerCase();
    if (!query) return shows;

    const startsWith: Show[] = [];
    const includes: Show[] = [];

    for (const show of shows) {
      const name = show.name.toLowerCase();
      if (name.startsWith(query)) {
        startsWith.push(show);
      } else if (name.includes(query)) {
        includes.push(show);
      }
    }

    return [...startsWith, ...includes];
  }

  isDefaultHost(input: string, show: Show | null | undefined) {
    if (show === null || show === undefined) return false;
    if (show.defaultHost === "") {
      return false;
    }

    return input.toLowerCase() === show.defaultHost.toLowerCase();
  }

  isDifferentHost(input: string, show: Show | null | undefined) {
    return !this.isDefaultHost(input, show);
  }
}
