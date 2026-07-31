import { ApiModel } from "../services/model-api";

export class Playlist implements ApiModel {
  id: number;
  show: number;
  showname: string;
  host: string;
  date: string;
  notes: string;
  tracks: string;
  complete: boolean;
  fillin: boolean;
  femaleQuota: number;
  localQuota: number;
  australianQuota: number;
}
