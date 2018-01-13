import * as auth from './auth.reducer';


export interface State {
  auth: auth.State;
}

export const REDUCER = {
  auth: auth.reducer
};
