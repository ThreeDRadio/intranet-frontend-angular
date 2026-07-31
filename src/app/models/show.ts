import { ApiModel } from "../services/model-api";

export class Show implements ApiModel {
  id: number;
  name: string;
  startTime: string;
  endTime: string;
  defaultHost: string;
  active: boolean;
  playlists: string;
  topartists: string;
  statistics: string;
  customQuotas: boolean;
  femaleQuota: number | null;
  localQuota: number | null;
  australianQuota: number | null;
}
