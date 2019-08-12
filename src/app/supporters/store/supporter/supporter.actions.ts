import { Supporter } from 'app/supporters/models/supporter';

export namespace SupporterActions {
  export interface SearchResult {
    count: number;
    next: string;
    previous: string;
    results: Array<Supporter>;
  }

  export const Types = {
    CLEAR: '[Supporter][Clear]',
    REQUEST_BY_ID: '[Supporter][Request] by id',
    RESPONSE_BY_ID: '[Supporter][Response] by id',
    REQUEST_SEARCH: '[Supporter][Request] simple search',
    RESPONSE_SEARCH: '[Supporter][Response] simple search',
    ERROR_SEARCH: '[Supporter][Error] simple search',
    REQUEST_UPDATE: '[Supporter][Request] update',
    RESPONSE_UPDATE: '[Supporter][Response] update',
    ERROR_UPDATE: '[Supporter][Error] update',
    REQUEST_CREATE: '[Supporter][Request] create',
    RESPONSE_CREATE: '[Supporter][Response] create',
    ERROR_CREATE: '[Supporter][Error] create'
  };

  export class Clear {
    readonly type = Types.CLEAR;
  }

  export class RequestById {
    readonly type = Types.REQUEST_BY_ID;
    constructor(public payload: string | number) {}
  }

  export class ResponseById {
    readonly type = Types.RESPONSE_BY_ID;
    constructor(public payload: any) {}
  }

  export class RequestSearch {
    readonly type = Types.REQUEST_SEARCH;
    constructor(
      public payload: {
        last_name?: string;
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

  export class RequestUpdate {
    readonly type = Types.REQUEST_UPDATE;
    constructor(public payload: { supporterId: number; payload: Supporter }) {}
  }

  export class ResponseUpdate {
    readonly type = Types.RESPONSE_UPDATE;
    constructor(public payload: Supporter) {}
  }

  export class ErrorUpdate {
    readonly type = Types.ERROR_UPDATE;
    constructor(public payload: any) {}
  }

  export class RequestCreate {
    readonly type = Types.REQUEST_CREATE;
    constructor(public payload: Supporter) {}
  }

  export class ResponseCreate {
    readonly type = Types.RESPONSE_CREATE;
    constructor(public payload: Supporter) {}
  }

  export class ErrorCreate {
    readonly type = Types.ERROR_CREATE;
    constructor(public payload: any) {}
  }

  export type Actions =
    | Clear
    | RequestById
    | ResponseById
    | RequestSearch
    | ResponseSearch
    | ErrorSearch
    | RequestCreate
    | ResponseCreate
    | ErrorCreate;
}
