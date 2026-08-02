import { inject } from "@angular/core";
import { map, Observable } from "rxjs";
import { Show } from "../models/show";
import { ShowApi } from "./show-api";

export class ShowService {
  readonly showApi = inject(ShowApi);

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
}
