import { PayloadAction } from '../actions';
import * as actions from '../actions/index';

export const LOCAL_STORAGE_AUTH_KEY = 'careapp.auth';

export interface State {
  loading: boolean;
  resetPassword: boolean;
  error: string;
  auth?: { id: string; ttl: number; created: Date; userId: string };
  user?: any;
  roles?: Array<string>;
  ready: boolean;
}

const initialState = {
  loading: false,
  resetPassword: false,
  error: '',
  ready: false
};

export function reducer(state: State = initialState, action: PayloadAction): State {
  switch (action.type) {
    case actions.REQUEST_AUTH_LOGIN:
    case actions.REQUEST_LOGGED_IN_USER: {
      return { ...state, loading: true, resetPassword: false };
    }

    case actions.AUTH_RESET_ERRORS: {
      return { ...state, error: '', resetPassword: false };
    }

    case actions.REQUEST_AUTH_LOGOUT: {
      return { ...state, auth: null, loading: true };
    }

    //case actions.APPLICATION_AUTHORIZED:
    //  return {
    //    ...state,
    //    ready: true
    //  };

    case actions.RESPONSE_SUCCESS_USER_ROLES:
      return { ...state, roles: action.payload };

    case actions.RESPONSE_SUCCESS_AUTH_LOGIN: {
      const newState = {
        ...state,
        loading: false,
        error: '',
        auth: {
          ...action.payload,
          created: action.payload.auth ? new Date(action.payload.auth.created) : undefined
        },
        user: { ...action.payload.user },
        roles: action.payload.roles
      };
      return newState;
    }

    case actions.RESPONSE_FAIL_AUTH_LOGOUT:
    case actions.RESPONSE_SUCCESS_AUTH_LOGOUT: {
      return initialState;
    }

    case actions.RESPONSE_FAIL_AUTH_LOGIN: {
      const error = action.payload.code || action.payload;
      return { ...state, auth: null, loading: false, error };
    }

    default:
      return state;
  }
}
