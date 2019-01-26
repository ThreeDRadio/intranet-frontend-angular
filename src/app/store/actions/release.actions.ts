export namespace ReleaseActions {
  export interface SearchResult {
    count: number;
    next: string;
    previous: string;
    results: Array<{
      id: number;
      arrivaldate: string;
      artist: string;
      title: string;
      year: number;
      company?: string;
      genre?: string;
      format: number;
      local: number;
      cpa: string;
      compilation: number;
      female: number;
      tracks: string;
      comments: string;
      createwho: number;
      createwhen: number;
      copies: number;
      modifywho: number;
      modifywhen: number;
    }>;
  }

  export const Types = {
    FETCH_RELEASE_BY_ID: '[Release][Request] by id',
    REQUEST_SIMPLE_SEARCH: '[Release][Request] simple search',
    RESPONSE_SIMPLE_SEARCH: '[Release][Response] simple search',
    ERROR_SIMPLE_SEARCH: '[Release][Error] simple search'
  };

  export class RequestSearch {
    readonly type = Types.REQUEST_SIMPLE_SEARCH;
    constructor(public payload: { search: string }) {}
  }

  export class ResponseSearch {
    readonly type = Types.RESPONSE_SIMPLE_SEARCH;
    constructor(public payload: SearchResult) {}
  }

  export class ErrorSearch {
    readonly type = Types.ERROR_SIMPLE_SEARCH;
    constructor(public payload?: any) {}
  }

  export type Actions = RequestSearch | ResponseSearch | ErrorSearch;
}
