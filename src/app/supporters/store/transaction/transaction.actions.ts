import { Transaction } from 'app/supporters/models/transaction';

export namespace TransactionActions {
  export const Types = {
    requestForSupporter: '[Transaction][Request] Transactions for supporter',
    responseForSupporter: '[Transaction][Response] Transactions for supporter',
    errorForSupporter: '[Transaction][Error] Transactions for release',

    requestCreateForSupporter: '[Transaction][Request] create for supporter',
    responseCreateForSupporter: '[Transaction][Response] create for supporter',
    errorCreateForSupporter: '[Transaction][Error] create for supporter',
    REQUEST_SEARCH: '[Transaction][Request] search',
    RESPONSE_SEARCH: '[Transaction][Response] search',
    ERROR_SEARCH: '[Transaction][Error] search',
    CLEAR: '[Transaction][Clear]'
  };

  export interface SearchResult {
    count: number;
    next: string;
    previous: string;
    results: Array<Transaction>;
  }

  export class RequestSearch {
    readonly type = Types.REQUEST_SEARCH;
    constructor(
      public payload: {
        last_name?: string;
        payment_processed?: boolean;
        pack_sent?: boolean;
        shipping?: string;
        id?: string;
        limit: number;
        offset: number;
        ordering: string;
      }
    ) {}
  }
  export class ResponseSearch {
    readonly type = Types.RESPONSE_SEARCH;
    constructor(public payload: SearchResult) {}
  }

  export class ErrorSearch {
    readonly type = Types.ERROR_SEARCH;
    constructor(public payload: any) {}
  }

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
  export class Clear {
    readonly type = Types.CLEAR;
  }

  export type Actions =
    | RequestForSupporter
    | ResponseForSupporter
    | ErrorForSupporter
    | RequestCreateForSupporter
    | ResponseCreateForSupporter
    | ErrorCreateForSupporter
    | RequestSearch
    | ResponseSearch
    | ErrorSearch
    | Clear;
}
