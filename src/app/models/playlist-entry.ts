import { ApiModel } from "../services/model-api";

export class PlaylistEntry implements ApiModel {
  id: number;
  index: number;
  artist: string;
  album: string;
  title: string;
  duration: string;
  local: boolean;
  australian: boolean;
  female: boolean;
  newRelease: boolean;
  playlist: number;
}
