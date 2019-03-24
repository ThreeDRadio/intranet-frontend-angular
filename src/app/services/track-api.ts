import { Injectable } from '@angular/core';

import { Track } from 'app/models';
import { BaseApi } from './base-api.service';
import { ApiModel, ModelApi } from './model-api';
import { Observable } from 'rxjs';

@Injectable()
export class TrackApi extends ModelApi<Track> {
  constructor(api: BaseApi) {
    super('tracks', api);
  }

  getForRelease(releaseId: string) {
    return this.http.get(`releases/${releaseId}/tracks`);
  }

  uploadHi(id: number, file: File) {
    return this.http.upload(`${this.modelName}/${id}/audio`, file);
  }

  getDownloadUrl(id: number): Observable<{ url: string }> {
    return this.http.get(`${this.modelName}/${id}/requestDownload`) as Observable<any>;
  }
}
