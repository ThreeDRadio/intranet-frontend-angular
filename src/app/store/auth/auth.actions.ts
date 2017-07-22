import {Action} from '@ngrx/store';

export const AUTH_REQUEST_LOGIN = '[Auth][Request] Login';
export const AUTH_RESPONSE_LOGIN_SUCCESS = '[Auth][Response] Login success';
export const AUTH_RESPONSE_LOGIN_FAILED = '[Auth][Response] Login failed';


export class RequestLogin implements Action {
  readonly type = AUTH_REQUEST_LOGIN;
  constructor(payload: {email: string, password: string}){};
}

export class ResponseLoginSuccess implements Action {
  readonly type = AUTH_RESPONSE_LOGIN_SUCCESS;
  constructor(payload: any){};
}

export class ResponseLoginFailed implements Action {
  readonly type = AUTH_RESPONSE_LOGIN_FAILED;
  constructor(payload: any){};
}

export type Actions = RequestLogin | ResponseLoginSuccess | ResponseLoginFailed;