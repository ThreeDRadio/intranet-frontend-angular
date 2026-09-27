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

  move(input: PlaylistEntryParams, to: number) {
    return this.http.post(`playlistentries/${input.id}/move`, { to });
  }
}
