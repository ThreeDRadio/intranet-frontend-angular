export namespace TransactionActions {
  export const Types = {
    requestForSupporter: '[Transaction][Request] Transactions for supporter',
    responseForSupporter: '[Transaction][Response] Transactions for supporter',
    errorForSupporter: '[Transaction][Error] Transactions for release'
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

  export type Actions = RequestForSupporter | ResponseForSupporter | ErrorForSupporter;
}
