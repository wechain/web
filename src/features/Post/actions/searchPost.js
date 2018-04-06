import { put, call, select, takeLatest } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import update from 'immutability-helper';
import api from 'utils/api';
import { getPostKey } from '../utils';
import { selectSearchTerm } from 'features/Post/selectors';

/*--------- CONSTANTS ---------*/
const SET_SEARCH_TERM = 'SET_SEARCH_TERM';
const SEARCH_POST_BEGIN = 'SEARCH_POST_BEGIN';
const SEARCH_POST_SUCCESS = 'SEARCH_POST_SUCCESS';
const SEARCH_POST_FAILURE = 'SEARCH_POST_FAILURE';

/*--------- ACTIONS ---------*/
export function setSearchTerm(term) {
  return { type: SET_SEARCH_TERM, term };
}

export function searchPostBegin() {
  return { type: SEARCH_POST_BEGIN  };
}

function searchPostSuccess(result) {
  return { type: SEARCH_POST_SUCCESS, result };
}

function searchPostFailure(message) {
  return { type: SEARCH_POST_FAILURE, message };
}

/*--------- REDUCER ---------*/
export function searchPostReducer(state, action) {
  switch (action.type) {
    case SET_SEARCH_TERM: {
      return update(state, { searchTerm: { $set: action.term } });
    }
    case SEARCH_POST_BEGIN: {
      return update(state, { isSearching: { $set: true } });
    }
    case SEARCH_POST_SUCCESS: {
      const { result } = action;

      const newPosts = {};
      const searchResult = [];
      result.posts.forEach(post => {
        const key = getPostKey(post);
        if (!state.posts[key]) { // only update non-existing post (preventing race-condition with getPost)
          newPosts[key] = post;
        }
        searchResult.push(key);
      });

      return update(state, {
        posts: { $merge: newPosts },
        searchResult: { $set: searchResult },
        isSearching: { $set: false },
      });
    }
    case SEARCH_POST_FAILURE: {
      return update(state, { isSearching: { $set: false } });
    }
    default:
      return state;
  }
}

/*--------- SAGAS ---------*/
function* searchPost() {
  try {
    yield call(delay, 300); // Prevent too many requests on typing
    const term = yield select(selectSearchTerm());
    const result = yield api.get(`/posts/search.json`, { q: term });

    yield put(searchPostSuccess(result));
  } catch(e) {
    yield put(searchPostFailure(e.message));
  }
}

export default function* searchPostManager() {
  yield takeLatest(SEARCH_POST_BEGIN, searchPost);
}
