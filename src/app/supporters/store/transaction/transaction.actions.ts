import { Transaction } from 'app/supporters/models/transaction';

export namespace TransactionActions {
  export const Types = {
    requestForSupporter: '[Transaction][Request] Transactions for supporter',
    responseForSupporter: '[Transaction][Response] Transactions for supporter',
    errorForSupporter: '[Transaction][Error] Transactions for release',

    requestCreateForSupporter: '[Transaction][Request] create for supporter',
    responseCreateForSupporter: '[Transaction][Response] create for supporter',
    errorCreateForSupporter: '[Transaction][Error] create for supporter'
  };

  export class RequestForSupporter {
    readonly type = Types.requestForSupporter;
    constructor(public payload: { supporterId: string }) {}
  }

  export class ResponseForSupporter {
    readonly type = Types.responseForSupporter;
    constructor(public payload: { supporterId: string; transactions: Array<any> }) {}
  }
  export class ErrorForSupporter {
    readonly type = Types.errorForSupporter;
    constructor(public payload: any) {}
  }

  export class RequestCreateForSupporter {
    readonly type = Types.requestCreateForSupporter;
    constructor(public payload: { supporterId: number; data: any }) {}
  }
  export class ResponseCreateForSupporter {
    readonly type = Types.responseCreateForSupporter;
    constructor(public payload: Transaction) {}
  }

  export class ErrorCreateForSupporter {
    readonly type = Types.errorCreateForSupporter;
    constructor(public payload: any) {}
  }

  export type Actions =
    | RequestForSupporter
    | ResponseForSupporter
    | ErrorForSupporter
    | RequestCreateForSupporter
    | ResponseCreateForSupporter
    | ErrorCreateForSupporter;
}
