import { TransactionActions } from './transaction.actions';

export interface TransactionState {
  // All the Transactions we currently have in the store
  entities: { [id: string]: any };

  // All the Transaction IDs for what we hav in the store
  ids: Array<number>;

  loading: boolean;

  /// Maps a release ID to a list of Transaction ids
  supporterTransactions: { [id: number]: Array<number> };

  count?: number;
  nextPage?: string;
  previousPage?: string;
  error?: any;
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
    case TransactionActions.Types.CLEAR:
      return initialState;
    case TransactionActions.Types.REQUEST_SEARCH:
      return { ...state, loading: true };
    case TransactionActions.Types.RESPONSE_SEARCH: {
      const responseAction = action as TransactionActions.ResponseSearch;
      return {
        ...state,
        loading: false,
        error: null,
        previousPage: responseAction.payload.previous,
        nextPage: responseAction.payload.next,
        count: responseAction.payload.count,
        ids: responseAction.payload.results.map(item => item.id),
        entities: responseAction.payload.results.reduce((accum, current) => {
          accum[current.id] = current;
          return accum;
        }, {})
      };
    }
    case TransactionActions.Types.requestForSupporter:
      return { ...state, loading: true };

    case TransactionActions.Types.responseCreateForSupporter: {
      const a = action as TransactionActions.ResponseCreateForSupporter;
      const supporterId = a.payload.supporter;
      const ids = Array.from(new Set([...state.ids, a.payload.id]));
      const entities = { ...state.entities, [a.payload.id]: a.payload };
      return {
        ...state,
        loading: false,
        ids,
        entities: { ...state.entities, ...entities },
        supporterTransactions: {
          ...state.supporterTransactions,
          [supporterId]: [...state.supporterTransactions[supporterId], a.payload.id]
        }
      };
    }

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
