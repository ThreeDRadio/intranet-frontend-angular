import { PayloadAction } from '../actions';
import * as actions from '../actions';

export const LOCAL_STORAGE_AUTH_KEY = 'threedradio.auth';

export interface State {
  loading: boolean;
  resetPassword: boolean;
  error: string;
  auth?: { token: string; userId: string };
  user?: any;
  roles?: Array<string>;
  ready: boolean;
}

const savedAuth = {
  token: window.localStorage.getItem('AUTH_TOKEN'),
  userId: window.localStorage.getItem('AUTH_USER')
};

const initialState: State = {
  loading: false,
  resetPassword: false,
  error: '',
  auth: savedAuth.token ? savedAuth : null,
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

    case actions.APP_READY:
      return {
        ...state,
        ready: true
      };

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
        }
      };
      return newState;
    }
    case actions.RESPONSE_SUCCESS_AUTH_PROFILE: {
      const newState = {
        ...state,
        loading: false,
        error: '',
        user: action.payload
      };
      return newState;
    }

    case actions.RESPONSE_FAIL_AUTH_LOGOUT:
    case actions.RESPONSE_SUCCESS_AUTH_LOGOUT: {
      return { ...initialState, ready: true };
    }

    case actions.RESPONSE_FAIL_AUTH_LOGIN: {
      const error = action.payload.code || action.payload;
      return { ...state, auth: null, loading: false, error };
    }

    default:
      return state;
  }
}
