import { ApiModel } from 'app/services/model-api';

export class Track implements ApiModel {
  id: number;
  tracknum: number;
  trackartist: string;
  tracktitle: string;
  tracklength: number;
  release: number;
  hiAvailable: boolean;
}
