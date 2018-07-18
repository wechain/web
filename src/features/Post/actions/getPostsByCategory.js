import { put, takeEvery } from 'redux-saga/effects';
import update from 'immutability-helper';
import api from 'utils/api';
import { getPostKey } from '../utils';
import { getSortOption } from 'utils/sortOptions';

/*--------- CONSTANTS ---------*/
const GET_POSTS_BY_CATEGORY_BEGIN = 'GET_POSTS_BY_CATEGORY_BEGIN';
const GET_POSTS_BY_CATEGORY_SUCCESS = 'GET_POSTS_BY_CATEGORY_SUCCESS';
const GET_POSTS_BY_CATEGORY_FAILURE = 'GET_POSTS_BY_CATEGORY_FAILURE';

/*--------- ACTIONS ---------*/
export function getPostsByCategoryBegin(category, page) {
  return { type: GET_POSTS_BY_CATEGORY_BEGIN, category, page };
}

export function getPostsByCategorySuccess(category, page, result) {
  return { type: GET_POSTS_BY_CATEGORY_SUCCESS, category, page, result };
}

export function getPostsByCategoryFailure(category, message) {
  return { type: GET_POSTS_BY_CATEGORY_FAILURE, category, message };
}

/*--------- REDUCER ---------*/
export function getPostsByCategoryReducer(state, action) {
  switch (action.type) {
    case GET_POSTS_BY_CATEGORY_BEGIN: {
      if (!state.categoryStatus[action.category]) {
        return update(state, {
          categoryStatus: { [action.category]: { $set: {
            loading: true,
            finished: false,
          }}},
        });
      }

      return update(state, {
        categoryStatus: { [action.category]: {
          loading: { $set: true },
        }},
      });
    }
    case GET_POSTS_BY_CATEGORY_SUCCESS: {
      const { category, page, result } = action;

      const newPosts = {};
      const postByCategory = [];
      result.posts.forEach(post => {
        const key = getPostKey(post);
        if (!state.posts[key]) { // only update non-existing post (preventing race-condition with getPost)
          newPosts[key] = post;
        }
        postByCategory.push(key);
      });

      let pushOrSet = { $push: postByCategory };
      if (!state.categoryPosts[category] || page === 1) {
        pushOrSet = { $set: postByCategory }
      }

      const newState = {
        posts: { $merge: newPosts },
        categoryPosts: { [category]: pushOrSet },
        categoryStatus: { [category]: {
          loading: { $set: false },
          finished: { $set: result.posts.length === 0 },
        }},
      }

      if (result.total_count && result.total_payout) {
        newState.categoryStatus[category].total_count = { $set: result.total_count }
        newState.categoryStatus[category].total_payout = { $set: result.total_payout }
      }

      return update(state, newState);
    }
    case GET_POSTS_BY_CATEGORY_FAILURE: {
      return update(state, {
        categoryStatus: { [action.category]: {
          loading: { $set: false },
          finished: { $set: false },
        }},
      });
    }
    default:
      return state;
  }
}

/*--------- SAGAS ---------*/
function* getPostsByCategory({ category, page }) {
  try {
    const result = yield api.get(`/category/${category}.json`, { page: page, sort: getSortOption('profile') });

    yield put(getPostsByCategorySuccess(category, page, result));
  } catch(e) {
    yield put(getPostsByCategoryFailure(category, e.message));
  }
}

export default function* getPostsByCategoryManager() {
  yield takeEvery(GET_POSTS_BY_CATEGORY_BEGIN, getPostsByCategory);
}
