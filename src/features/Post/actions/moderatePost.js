import { put, takeEvery } from 'redux-saga/effects';
import update from 'immutability-helper';
import api from 'utils/api';
import { getPostKey } from '../utils';
import { notification } from 'antd';

/*--------- CONSTANTS ---------*/
const SET_MODERATOR_BEGIN = 'SET_MODERATOR_BEGIN';
const MODERATE_POST_BEGIN = 'MODERATE_POST_BEGIN';
const MODERATE_POST_SUCCESS = 'MODERATE_POST_SUCCESS';
const MODERATE_POST_FAILURE = 'MODERATE_POST_FAILURE';

/*--------- ACTIONS ---------*/
export function setModeratorBegin(post) {
  return { type: SET_MODERATOR_BEGIN, post };
}

export function moderatePostBegin(post, to_active, to_verified) {
  return { type: MODERATE_POST_BEGIN, post, to_active, to_verified };
}

export function moderatePostSuccess(post, is_active, is_verified, verified_by) {
  return { type: MODERATE_POST_SUCCESS, post, is_active, is_verified, verified_by };
}

export function moderatePostFailure(message) {
  return { type: MODERATE_POST_FAILURE, message };
}

/*--------- REDUCER ---------*/
export function moderatePostReducer(state, action) {
  switch (action.type) {
    case MODERATE_POST_SUCCESS:
      const { post, is_active, is_verified, verified_by } = action;
      const key = getPostKey(post);

      return update(state, {
        posts: { [key]: {
          is_active: { $set: is_active },
          is_verified: { $set: is_verified },
          verified_by: { $set: verified_by },
        }},
      });
    default:
      return state;
  }
}

/*--------- SAGAS ---------*/
function* setModerator({ post }) {
  try {
    const { is_active, is_verified, verified_by } = yield api.setModerator(post);
    yield put(moderatePostSuccess(post, is_active, is_verified, verified_by));
  } catch (e) {
    yield put(moderatePostFailure(e.message));
    yield notification['error']({ message: e.message });
  }
}

function* moderatePost({ post, to_active, to_verified }) {
  try {
    const { is_active, is_verified, verified_by } = yield api.moderatePost(post, to_active, to_verified);
    yield put(moderatePostSuccess(post, is_active, is_verified, verified_by));

    yield notification['success']({ message: `Active: ${is_active} / Verified: ${is_verified}` });
  } catch (e) {
    yield put(moderatePostFailure(e.message));
    yield notification['error']({ message: e.message });
  }
}

export function* setModeratorManager() {
  yield takeEvery(SET_MODERATOR_BEGIN, setModerator);
}

export function* moderatePostManager() {
  yield takeEvery(MODERATE_POST_BEGIN, moderatePost);
}
