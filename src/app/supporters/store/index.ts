import * as Supporter from './supporter/supporter.reducer';
import * as Transaction from './transaction/transaction.reducer';

export interface State {
  supporters: Supporter.SupporterState;
  transactions: Transaction.TransactionState;
}

export const REDUCER = {
  supporters: Supporter.reducer,
  transactions: Transaction.reducer
};
