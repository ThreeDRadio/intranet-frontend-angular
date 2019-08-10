import { Injectable } from '@angular/core';

import { Comment } from 'app/models/comment';
import { ModelApi } from 'app/services/model-api';
import { BaseApi } from 'app/services';

@Injectable()
export class SupporterApi extends ModelApi<Comment> {
  constructor(api: BaseApi) {
    super('supporters', api);
  }
  search(params: { search?: string; limit: number; offset: number; ordering: string }) {
    return super.list({ responseType: 'json', params });
  }
}
