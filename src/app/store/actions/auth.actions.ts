import { Action } from '@ngrx/store';

export const REQUEST_AUTH_LOGIN = '[Auth][Request] Auth Login';
export const RESPONSE_SUCCESS_AUTH_LOGIN = '[Auth][Response][Success] Auth Login';
export const RESPONSE_FAIL_AUTH_LOGIN = '[Auth][Response][Fail] Auth Login';

export const REQUEST_AUTH_LOGOUT = '[Auth][Request] Auth Logout';
export const RESPONSE_SUCCESS_AUTH_LOGOUT = '[Auth][Response][Success] Auth Logout';
export const RESPONSE_FAIL_AUTH_LOGOUT = '[Auth][Response][Fail] Auth Logout';

export const REQUEST_AUTH_REFRESH = '[Auth][Request] Auth Refresh';
export const RESPONSE_SUCCESS_AUTH_REFRESH = '[Auth][Response][Success] Auth Refresh';
export const RESPONSE_FAIL_AUTH_REFRESH = '[Auth][Response][Fail] Auth Refresh';

export const REQUEST_LOGGED_IN_USER = '[Auth][Request] get logged in user';
export const RESPONSE_SUCCESS_LOGGED_IN_USER = '[Auth][Response][Success] get logged in user';
export const RESPONSE_FAIL_LOGGED_IN_USER = '[Auth][Response][Fail] get logged in user';

export const REQUEST_USER_ROLES = '[Auth][Request] User Roles';
export const RESPONSE_SUCCESS_USER_ROLES = '[Auth][Response][Success] User Roles';
export const RESPONSE_FAIL_USER_ROLES = '[Auth][Response][Fail] User Roles';

export const AUTH_RESET_ERRORS = '[Auth] Auth Reset Errors';
export const FORCE_LOGOUT_401 = '[Auth] Force Logout 401';

export class RequestLoggedInUser implements Action {
  readonly type = REQUEST_LOGGED_IN_USER;
  constructor(public payload: string) {}
}

export class ResponseSuccessLoggedInUser implements Action {
  readonly type = RESPONSE_SUCCESS_LOGGED_IN_USER;
  constructor(public payload: any) {}
}

export class ResponseFailLoggedInUser implements Action {
  readonly type = RESPONSE_FAIL_LOGGED_IN_USER;
  constructor(public payload: any) {}
}

export class RequestUserRoles implements Action {
  readonly type = REQUEST_USER_ROLES;
  constructor() {}
}

export class ResponseSuccessUserRoles implements Action {
  readonly type = RESPONSE_SUCCESS_USER_ROLES;
  constructor(public payload: any) {}
}

export class ResponseFailUserRoles implements Action {
  readonly type = RESPONSE_FAIL_USER_ROLES;
  constructor(public payload: any) {}
}

export class RequestAuthLoginAction implements Action {
  readonly type = REQUEST_AUTH_LOGIN;
  constructor(public payload: { username: string; password: string }) {}
}

export class ResponseSuccessAuthLoginAction implements Action {
  readonly type = RESPONSE_SUCCESS_AUTH_LOGIN;
  constructor(public payload: any) {}
}

export class ResponseFailAuthLoginAction implements Action {
  readonly type = RESPONSE_FAIL_AUTH_LOGIN;
  constructor(public payload: any) {}
}

export class RequestAuthLogoutAction implements Action {
  readonly type = REQUEST_AUTH_LOGOUT;
}

export class ResponseSuccessAuthLogoutAction implements Action {
  readonly type = RESPONSE_SUCCESS_AUTH_LOGOUT;
}

export class ResponseFailAuthLogoutAction implements Action {
  readonly type = RESPONSE_FAIL_AUTH_LOGOUT;
  constructor(public payload: any) {}
}

export class AuthResetErrorsAction implements Action {
  readonly type = AUTH_RESET_ERRORS;
}

export class RequestAuthRefreshAction implements Action {
  readonly type = REQUEST_AUTH_REFRESH;
}

export class ResponseSuccessAuthRefreshAction implements Action {
  readonly type = RESPONSE_SUCCESS_AUTH_REFRESH;
  constructor(public payload: any) {}
}

export class ResponseFailAuthRefreshAction implements Action {
  readonly type = RESPONSE_FAIL_AUTH_REFRESH;
  constructor(public payload?: any) {}
}

export class ForceLogout401 implements Action {
  readonly type = FORCE_LOGOUT_401;
  constructor(public payload?: string) {}
}
