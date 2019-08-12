import { TransactionActions } from './transaction.actions';

export interface TransactionState {
  // All the Transactions we currently have in the store
  entities: { [id: string]: any };

  // All the Transaction IDs for what we hav in the store
  ids: Array<string>;

  loading: boolean;

  /// Maps a release ID to a list of Transaction ids
  supporterTransactions: { [id: string]: Array<string> };
}

export const initialState: TransactionState = {
  entities: {},
  ids: [],
  loading: false,
  supporterTransactions: {}
};

export function reducer(
  state: TransactionState = initialState,
  action: TransactionActions.Actions
): TransactionState {
  switch (action.type) {
    case TransactionActions.Types.requestForSupporter:
      return { ...state, loading: true };
    case TransactionActions.Types.responseForSupporter: {
      const a = action as TransactionActions.ResponseForSupporter;
      const supporterId = a.payload.supporterId;
      const transactionIds = a.payload.transactions.map(transaction => transaction.id);
      const ids = Array.from(new Set([...state.ids, ...transactionIds]));
      const entities = a.payload.transactions.reduce((accum, current) => {
        accum[current.id] = current;
        return accum;
      }, {});
      return {
        ...state,
        loading: false,
        ids,
        entities: { ...state.entities, ...entities },
        supporterTransactions: { ...state.supporterTransactions, [supporterId]: transactionIds }
      };
    }
    default:
      return state;
  }
}
