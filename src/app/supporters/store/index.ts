import * as Supporter from './supporter/supporter.reducer';

export interface State {
  supporters: Supporter.SupporterState;
  transactions: {};
}

export const REDUCER = {
  supporters: Supporter.reducer,
  transactions: () => {}
};
