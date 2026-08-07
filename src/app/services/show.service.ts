import { inject, Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { Show } from "../models/show";
import { ShowApi } from "./show-api";

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

        return list.map((item: any) => {
          return item as Show;
        });
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
}
