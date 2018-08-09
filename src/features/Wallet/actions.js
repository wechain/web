import combine from 'utils/combine';
import getTransactions, { getTransactionsReducer } from './actions/getTransactions';
import claimTokens, { claimTokensReducer } from './actions/claimTokens';
import setEthAddress, { setEthAddressReducer } from './actions/setEthAddress';

export const initialState = {
  balance: '',
  spToClaim: -1.0,
  ethAddress: null,
  transactions: [],
  isLoading: false,
  isClaiming: false,
  isUpdating: false,
};

export const reducer = (state = initialState, action) => combine(
  [
    getTransactionsReducer,
    claimTokensReducer,
    setEthAddressReducer,
  ],
  state,
  action,
);

// All sagas to be loaded
export default [
  getTransactions,
  claimTokens,
  setEthAddress,
];
