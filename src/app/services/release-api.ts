import { Injectable } from '@angular/core';

import { BaseApi } from './base-api.service';
import { ApiModel, ModelApi } from './model-api';

class ReleaseModel implements ApiModel {
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

@Injectable()
export class ReleaseApi extends ModelApi<ReleaseModel> {
  constructor(api: BaseApi) {
    super('releases', api);
  }

  simpleSearch(params: { search: string; limit: number; offset: number; ordering: string }) {
    const p = {
      search: params.search,
      offset: String(params.offset),
      limit: String(params.limit),
      ordering: params.ordering
    };
    return super.list({ responseType: 'json', params: p });
  }

  create(object: Object) {
    // need to add the user ID for now
    return super.create({ ...object, modifywho: this.http.userId, createwho: this.http.userId });
  }
}
