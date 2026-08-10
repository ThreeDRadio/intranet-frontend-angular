import { inject, Injectable } from "@angular/core";
import { ModelApi } from "./model-api";
import { BaseApi } from "./base-api.service";
import { PlaylistEntry } from "../models/playlist-entry";

type PlaylistEntryParams = {
  id: number;
};

@Injectable()
export class PlaylistEntryApi extends ModelApi<PlaylistEntry> {
  constructor() {
    super("playlistentries", inject(BaseApi));
  }
}
