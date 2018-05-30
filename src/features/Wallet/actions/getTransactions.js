import { put, takeEvery } from 'redux-saga/effects';
import update from 'immutability-helper';
import api from 'utils/api';

/*--------- CONSTANTS ---------*/
const GET_TRANSACTION_BEGIN = 'GET_TRANSACTION_BEGIN';
const GET_TRANSACTION_SUCCESS = 'GET_TRANSACTION_SUCCESS';
const GET_TRANSACTION_FAILURE = 'GET_TRANSACTION_FAILURE';

/*--------- ACTIONS ---------*/
export function getTransactionsBegin() {
  return { type: GET_TRANSACTION_BEGIN };
}

function getTransactionsSuccess(transactions) {
  return { type: GET_TRANSACTION_SUCCESS, transactions };
}

function getTransactionsFailure(message) {
  return { type: GET_TRANSACTION_FAILURE, message };
}

/*--------- REDUCER ---------*/
export function getTransactionsReducer(state, action) {
  switch (action.type) {
    case GET_TRANSACTION_BEGIN:
      return update(state, {
        isLoading: { $set: true },
      });
    case GET_TRANSACTION_SUCCESS:
      const { transactions } = action;

      return update(state, {
        balance: { $set: transactions.balance },
        ethAddress: { $set: transactions.eth_address },
        transactions: { $set: transactions.transactions },
        isLoading: { $set: false },
      });
    default:
      return state;
  }
}

/*--------- SAGAS ---------*/
function* getTransactions() {
  try {
    const transactions = yield api.get(`/hunt_transactions.json`);

    yield put(getTransactionsSuccess(transactions));
  } catch(e) {
    yield put(getTransactionsFailure(e.message));
  }
}

export default function* getTransactionsManager() {
  yield takeEvery(GET_TRANSACTION_BEGIN, getTransactions);
}
