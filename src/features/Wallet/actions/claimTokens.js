import { put, takeLatest } from 'redux-saga/effects';
import update from 'immutability-helper';
import { notification } from 'antd';
import api from 'utils/api';
import { extractErrorMessage } from 'utils/errorMessage';

/*--------- CONSTANTS ---------*/
const CLAIM_TOKENS_BEGIN = 'CLAIM_TOKENS_BEGIN';
const CLAIM_TOKENS_SUCCESS = 'CLAIM_TOKENS_SUCCESS';
const CLAIM_TOKENS_FAILURE = 'CLAIM_TOKENS_FAILURE';

/*--------- ACTIONS ---------*/
export function claimTokensBegin() {
  return { type: CLAIM_TOKENS_BEGIN };
}

function claimTokensSuccess(result) {
  return { type: CLAIM_TOKENS_SUCCESS, result };
}

function claimTokensFailure(message) {
  return { type: CLAIM_TOKENS_FAILURE, message };
}

/*--------- REDUCER ---------*/
export function claimTokensReducer(state, action) {
  switch (action.type) {
    case CLAIM_TOKENS_BEGIN:
      return update(state, {
        isClaiming: { $set: true },
      });
    case CLAIM_TOKENS_SUCCESS:
      const { result } = action;
      result.sp_claim.total_claimed = parseFloat(result.sp_claim.total_claimed);

      return update(state, {
        balance: { $set: result.balance },
        spClaim: { $set: result.sp_claim },
        transactions: { $unshift: [result.transaction] }, // put on top
        isClaiming: { $set: false },
      });
    case CLAIM_TOKENS_FAILURE:
      return update(state, {
        isClaiming: { $set: false },
      });
    default:
      return state;
  }
}

/*--------- SAGAS ---------*/
function* claimTokens() {
  try {
    const result = yield api.post(`/hunt_transactions/sp_claim.json`, null, true);

    yield put(claimTokensSuccess(result));
  } catch(e) {
    yield notification['error']({ message: extractErrorMessage(e) });
    yield put(claimTokensFailure(e.message));
  }
}

export default function* claimTokensManager() {
  yield takeLatest(CLAIM_TOKENS_BEGIN, claimTokens);
}
