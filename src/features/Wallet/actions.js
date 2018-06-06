import combine from 'utils/combine';
import getTransactions, { getTransactionsReducer } from './actions/getTransactions';

export const initialState = {
  balance: '',
  ethAddress: null,
  transactions: [],
  isLoading: false,
};

export const reducer = (state = initialState, action) => combine(
  [
    getTransactionsReducer,
  ],
  state,
  action,
);

// All sagas to be loaded
export default [
  getTransactions,
];
