import { put, takeEvery } from 'redux-saga/effects';
import update from 'immutability-helper';
import { getPostKey } from '../utils';
import api from 'utils/api';
import { calculateContentPayout } from 'utils/helpers/steemitHelpers';

/*--------- CONSTANTS ---------*/
const POST_REFRESH_BEGIN = 'POST_REFRESH_BEGIN';
const POST_REFRESH_SUCCESS = 'POST_REFRESH_SUCCESS';
const POST_REFRESH_FAILURE = 'POST_REFRESH_FAILURE';
const POST_INCREASE_COMMENT_COUNT = 'POST_INCREASE_COMMENT_COUNT';

/*--------- ACTIONS ---------*/
export function postRefreshBegin(post) {
  return { type: POST_REFRESH_BEGIN, post };
}

export function postRefreshSuccess(post, hunt_score) {
  return { type: POST_REFRESH_SUCCESS, post, hunt_score };
}

export function postRefreshFailure(message) {
  return { type: POST_REFRESH_FAILURE, message };
}

export function postIncreaseCommentCount(post) {
  return { type: POST_INCREASE_COMMENT_COUNT, post };
}

/*--------- REDUCER ---------*/
export function postRefreshReducer(state, action) {
  switch (action.type) {
    case POST_REFRESH_SUCCESS: {
      const { post, hunt_score } = action;

      const updated = { [getPostKey(post)]: {
        payout_value: { $set: calculateContentPayout(post) || post.payout_value },
        active_votes: { $set: post.active_votes },
        isUpdating: { $set: false },
      }};
      if (hunt_score) { // only when API update
        update['hunt_score'] = hunt_score;
      }

      return update(state, {
        posts: updated,
      });
    }
    case POST_INCREASE_COMMENT_COUNT: {
      const { post } = action;
      return update(state, {
        posts: { [getPostKey(post)]: {
          children: { $set: post.children + 1 },
        }},
      });
    }
    default:
      return state;
  }
}

/*--------- SAGAS ---------*/
function* postRefresh({ post }) {
  try {
    const res = yield api.refreshPost(post);
    yield put(postRefreshSuccess(post, res['hunt_score']));
  } catch (e) {
    yield put(postRefreshFailure(e.message));
  }
}

export default function* postRefreshManager() {
  yield takeEvery(POST_REFRESH_BEGIN, postRefresh);
}
