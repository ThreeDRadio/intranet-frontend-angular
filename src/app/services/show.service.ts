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
}
