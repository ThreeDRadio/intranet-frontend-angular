import { ApiModel } from '../services/model-api';
export class Release implements ApiModel {
  id: number;
  arrivaldate: string;
  artist: string;
  title: string;
  year: string;
  company: string;
  genre: string;
  format: number;
  local: number;
  cpa: number;
  compilation: number;
  female: number;
  createwho: number;
  createwhen: number;
}
