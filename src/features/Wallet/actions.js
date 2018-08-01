import combine from 'utils/combine';
import getTransactions, { getTransactionsReducer } from './actions/getTransactions';
import claimTokens, { claimTokensReducer } from './actions/claimTokens';

export const initialState = {
  balance: '',
  spToClaim: -1.0,
  ethAddress: null,
  transactions: [],
  isLoading: false,
};

export const reducer = (state = initialState, action) => combine(
  [
    getTransactionsReducer,
    claimTokensReducer,
  ],
  state,
  action,
);

// All sagas to be loaded
export default [
  getTransactions,
  claimTokens,
];
