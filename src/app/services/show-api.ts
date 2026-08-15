import { inject, Injectable } from "@angular/core";
import { ModelApi } from "./model-api";
import { BaseApi } from "./base-api.service";
import { Show } from "../models/show";
import { forkJoin, of } from "rxjs";

type ShowSearchParams = {
  ids: number[];
};

@Injectable()
export class ShowApi extends ModelApi<Show> {
  constructor() {
    super("shows", inject(BaseApi));
  }

  getShows(params: ShowSearchParams) {
    if (params.ids.length == 0) return of([]);

    let observables = params.ids.map((id) => this.http.get(`shows/${id}`));
    return forkJoin(observables);
  }

  getAllShows() {
    return super.list({ responseType: "json" });
  }
}
