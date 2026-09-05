import { inject, Injectable } from "@angular/core";
import { ModelApi } from "./model-api";
import { BaseApi } from "./base-api.service";
import { PlaylistEntry } from "../models/playlist-entry";
import { forkJoin } from "rxjs";

type PlaylistEntryParams = {
  id: number;
};

@Injectable()
export class PlaylistEntryApi extends ModelApi<PlaylistEntry> {
  constructor() {
    super("playlistentries", inject(BaseApi));
  }

  reorderEntries(entries: PlaylistEntry[]) {
    let observables = entries.map((e) =>
      this.http.patch(`playlistentries/${e.id}`, { index: e.index }),
    );
    return forkJoin(observables);
  }
}
