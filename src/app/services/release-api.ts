import { Injectable } from '@angular/core';

import { BaseApi } from './base-api.service';
import { ModelApi } from './model-api';
import { Release } from '../models/release';

@Injectable()
export class ReleaseApi extends ModelApi<Release> {
  constructor(api: BaseApi) {
    super('releases', api);
  }

  simpleSearch(params: {
    search?: string;
    min_arrival?: string;
    limit: number;
    offset: number;
    ordering: string;
  }) {
    return super.list({ responseType: 'json', params });
  }

  create(object: Object) {
    // need to add the user ID for now
    return super.create({ ...object, modifywho: this.http.userId, createwho: this.http.userId });
  }
}
