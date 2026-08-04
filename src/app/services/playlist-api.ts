import { inject, Injectable } from "@angular/core";
import { Playlist } from "../models";
import { ModelApi } from "./model-api";
import { BaseApi } from "./base-api.service";

type PlaylistSearchParams = {
  page: number;
  ordering: string;
};

type PlaylistFetchParams = {
  id: number;
};

type PlaylistEntryFetchParams = {
  id: number;
};

@Injectable()
export class PlaylistApi extends ModelApi<Playlist> {
  constructor() {
    super("playlists", inject(BaseApi));
  }

  getPlaylistPage(params: PlaylistSearchParams) {
    return super.list({ responseType: "json", params });
  }

  getPlaylist(params: PlaylistFetchParams) {
    return super.get(params.id);
  }

  getPlaylistEntries(params: PlaylistEntryFetchParams) {
    return super.getSubresource(params.id, "tracks");
  }
}
