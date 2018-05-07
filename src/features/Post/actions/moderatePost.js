import { put, select, takeEvery } from 'redux-saga/effects';
import update from 'immutability-helper';
import api from 'utils/api';
import { selectPostByKey } from '../selectors';
import { getPostKey } from '../utils';

/*--------- CONSTANTS ---------*/
const MODERATE_POST_BEGIN = 'MODERATE_POST_BEGIN';
const MODERATE_POST_SUCCESS = 'MODERATE_POST_SUCCESS';
const MODERATE_POST_FAILURE = 'MODERATE_POST_FAILURE';

/*--------- ACTIONS ---------*/
export function moderatePostBegin(post, hide, verify) {
  return { type: MODERATE_POST_BEGIN, post, hide, verify };
}

export function moderatePostSuccess(post, hide, verify) {
  return { type: MODERATE_POST_SUCCESS, post, hide, verify };
}

export function moderatePostFailure(message) {
  return { type: MODERATE_POST_FAILURE, message };
}

/*--------- REDUCER ---------*/
export function moderatePostReducer(state, action) {
  switch (action.type) {
    case MODERATE_POST_SUCCESS:
      const { post, hide, verify } = action;
      const key = getPostKey(post);

      return update(state, {
        posts: { [key]: {
          is_active: { $set: !hide },
          is_verified: { $set: verify },
        }},
      });
    default:
      return state;
  }
}

/*--------- SAGAS ---------*/
function* moderatePost({ post, hide, verify }) {
  try {
    yield api.moderatePost(post, hide, verify);
    yield put(moderatePostSuccess(post, hide, verify));
  } catch (e) {
    yield put(moderatePostFailure(e.message));
  }
}

export default function* moderatePostManager() {
  yield takeEvery(MODERATE_POST_BEGIN, moderatePost);
}
