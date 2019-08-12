import { createSelector } from '@ngrx/store';
import { TransactionState } from './transaction.reducer';

export namespace TransactionSelectors {
  export const transactionState = (state: { supporters: { transactions: TransactionState } }) =>
    state.supporters.transactions;

  export const isLoading = createSelector(
    transactionState,
    state => state.loading
  );

  export const getIds = createSelector(
    transactionState,
    state => state.ids
  );
  export const getEntities = createSelector(
    transactionState,
    state => state.entities
  );
  export const getAll = createSelector(
    getIds,
    getEntities,
    (ids, entities) => ids.map(id => entities[id])
  );

  export const transactionsForSupporter = (releaseId: string) => {
    return createSelector(
      transactionState,
      state => {
        if (state.supporterTransactions[releaseId]) {
          return state.supporterTransactions[releaseId].map(id => state.entities[id]);
        }
        return [];
      }
    );
  };
}
