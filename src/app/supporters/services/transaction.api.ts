import { Injectable } from '@angular/core';

import { Comment } from 'app/models/comment';
import { ModelApi } from 'app/services/model-api';
import { BaseApi } from 'app/services';
import { Transaction } from '../models/transaction';

@Injectable()
export class TransactionApi extends ModelApi<Transaction> {
  constructor(api: BaseApi) {
    super('transactions', api);
  }

  search(params: {
    payment_processed?: any;
    pack_sent?: any;
    search?: string;
    limit: number;
    offset: number;
    ordering: string;
  }) {
    return super.list({ responseType: 'json', params });
  }

  getForSupporter(supporterId: string) {
    return this.http.get(`supporters/${supporterId}/transactions`);
  }

  createForSupporter(supporterId: number, data: any) {
    return this.http.post(`supporters/${supporterId}/transactions`, data);
  }
}
