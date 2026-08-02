import { inject, Injectable } from "@angular/core";
import { Playlist } from "../models";
import { ModelApi } from "./model-api";
import { BaseApi } from "./base-api.service";

type PlaylistSearchParams = {
  page: number;
  ordering: string;
};

@Injectable()
export class PlaylistApi extends ModelApi<Playlist> {
  constructor() {
    super("playlists", inject(BaseApi));
  }

  getPlaylistPage(params: PlaylistSearchParams) {
    return super.list({ responseType: "json", params });
  }
}
