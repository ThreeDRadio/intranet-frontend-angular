import { ReleaseApi } from "./release-api";
import { TrackApi } from "./track-api";
import { CommentApi } from "./comment-api";
import { PlaylistApi } from "./playlist-api";
import { ShowApi } from "./show-api";

export * from "./id3.service";
export * from "./base-api.service";

export const API = [ReleaseApi, TrackApi, CommentApi, PlaylistApi, ShowApi];
