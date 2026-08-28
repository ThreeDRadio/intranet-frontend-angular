import { inject, Injectable } from "@angular/core";
import { EMPTY } from "rxjs";
import { ReleaseApi } from "./release-api";

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
}
