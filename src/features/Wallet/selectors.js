import { createSelector } from 'reselect';

const selectWalletDomain = () => state => state.wallet;

export const selectBalance = () => createSelector(
  selectWalletDomain(),
  state => state.balance,
);

export const selectTransactions = () => createSelector(
  selectWalletDomain(),
  state => state.transactions,
);

export const selectIsLoading = () => createSelector(
  selectWalletDomain(),
  state => state.isLoading,
);