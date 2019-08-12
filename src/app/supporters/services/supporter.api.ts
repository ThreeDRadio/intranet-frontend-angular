import { Injectable } from '@angular/core';

import { ModelApi } from 'app/services/model-api';
import { BaseApi } from 'app/services';
import { Supporter } from '../models/supporter';

@Injectable()
export class SupporterApi extends ModelApi<Supporter> {
  constructor(api: BaseApi) {
    super('supporters', api);
  }
  search(params: { search?: string; limit: number; offset: number; ordering: string }) {
    return super.list({ responseType: 'json', params });
  }
}
