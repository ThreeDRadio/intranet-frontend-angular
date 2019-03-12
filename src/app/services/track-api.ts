import { Injectable } from '@angular/core';

import { BaseApi } from './base-api.service';
import { ApiModel, ModelApi } from './model-api';

class TrackModel implements ApiModel {
  id: number;
  tracknum: number;
  trackartist: string;
  tracktitle: string;
  tracklength: number;
  release: number;
  hiAvailable: boolean;
}

@Injectable()
export class TrackApi extends ModelApi<TrackModel> {
  constructor(api: BaseApi) {
    super('tracks', api);
  }

  getForRelease(releaseId: string) {
    return this.http.get(`releases/${releaseId}/tracks`);
  }

  uploadHi(id: number, file: File) {
    return this.http.upload(`${this.modelName}/${id}/audio`, file);
  }
}