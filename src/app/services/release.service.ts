import { inject, Injectable } from "@angular/core";
import { EMPTY } from "rxjs";
import { ReleaseApi } from "./release-api";

@Injectable({
  providedIn: "root",
})
export class ReleaseService {
  readonly releaseApi = inject(ReleaseApi);

  quickSearch(term: string) {
    return this.releaseApi.simpleSearch({
      search: term,
      limit: 10,
      offset: 0,
      ordering: "-createwhen",
    });
  }
}
