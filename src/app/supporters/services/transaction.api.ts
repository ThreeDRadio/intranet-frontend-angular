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
}
