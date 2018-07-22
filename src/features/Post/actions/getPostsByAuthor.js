import { put, takeEvery } from 'redux-saga/effects';
import update from 'immutability-helper';
import api from 'utils/api';
import { getPostKey } from '../utils';
import { getSortOption } from 'utils/sortOptions';

/*--------- CONSTANTS ---------*/
const GET_POSTS_BY_AUTHOR_BEGIN = 'GET_POSTS_BY_AUTHOR_BEGIN';
const GET_POSTS_BY_AUTHOR_SUCCESS = 'GET_POSTS_BY_AUTHOR_SUCCESS';
const GET_POSTS_BY_AUTHOR_FAILURE = 'GET_POSTS_BY_AUTHOR_FAILURE';

/*--------- ACTIONS ---------*/
export function getPostsByAuthorBegin(author, page) {
  return { type: GET_POSTS_BY_AUTHOR_BEGIN, author, page };
}

export function getPostsByAuthorSuccess(author, page, result) {
  return { type: GET_POSTS_BY_AUTHOR_SUCCESS, author, page, result };
}

export function getPostsByAuthorFailure(author, message) {
  return { type: GET_POSTS_BY_AUTHOR_FAILURE, author, message };
}

/*--------- REDUCER ---------*/
export function getPostsByAuthorReducer(state, action) {
  switch (action.type) {
    case GET_POSTS_BY_AUTHOR_BEGIN: {
      if (!state.authorStatus[action.author]) {
        return update(state, {
          authorStatus: { [action.author]: { $set: {
            loading: true,
            finished: false,
          }}},
        });
      }

      return update(state, {
        authorStatus: { [action.author]: {
          loading: { $set: true },
        }},
      });
    }
    case GET_POSTS_BY_AUTHOR_SUCCESS: {
      const { author, page, result } = action;

      const newPosts = {};
      const postByAuthor = [];
      result.posts.forEach(post => {
        const key = getPostKey(post);
        if (!state.posts[key]) { // only update non-existing post (preventing race-condition with getPost)
          newPosts[key] = post;
        }
        postByAuthor.push(key);
      });

      let pushOrSet = { $push: postByAuthor };
      if (!state.authorPosts[author] || page === 1) {
        pushOrSet = { $set: postByAuthor }
      }

      const newState = {
        posts: { $merge: newPosts },
        authorPosts: { [author]: pushOrSet },
        authorStatus: { [author]: {
          loading: { $set: false },
          finished: { $set: result.posts.length === 0 },
          error: { $set: false },
        }},
      }

      if (result.total_count && result.total_payout) {
        newState.authorStatus[author].total_count = { $set: result.total_count }
        newState.authorStatus[author].total_payout = { $set: result.total_payout }
      }

      return update(state, newState);
    }
    case GET_POSTS_BY_AUTHOR_FAILURE: {
      return update(state, {
        authorStatus: { [action.author]: {
          loading: { $set: false },
          finished: { $set: false },
          error: { $set: true },
        }},
      });
    }
    default:
      return state;
  }
}

/*--------- SAGAS ---------*/
function* getPostsByAuthor({ author, page }) {
  try {
    const result = yield api.get(`/posts/@${author}.json`, { page: page, sort: getSortOption('profile') });

    yield put(getPostsByAuthorSuccess(author, page, result));
  } catch(e) {
    yield put(getPostsByAuthorFailure(author, e.message));
  }
}

export default function* getPostsByAuthorManager() {
  yield takeEvery(GET_POSTS_BY_AUTHOR_BEGIN, getPostsByAuthor);
}
