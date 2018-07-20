import { put, takeEvery } from 'redux-saga/effects';
import update from 'immutability-helper';
import api from 'utils/api';
import { getPostKey } from '../utils';
import { getSortOption } from 'utils/sortOptions';

/*--------- CONSTANTS ---------*/
const GET_POSTS_BY_TAG_BEGIN = 'GET_POSTS_BY_TAG_BEGIN';
const GET_POSTS_BY_TAG_SUCCESS = 'GET_POSTS_BY_TAG_SUCCESS';
const GET_POSTS_BY_TAG_FAILURE = 'GET_POSTS_BY_TAG_FAILURE';

/*--------- ACTIONS ---------*/
export function getPostsByTagBegin(tag, page) {
  return { type: GET_POSTS_BY_TAG_BEGIN, tag, page };
}

export function getPostsByTagSuccess(tag, page, result) {
  return { type: GET_POSTS_BY_TAG_SUCCESS, tag, page, result };
}

export function getPostsByTagFailure(tag, message) {
  return { type: GET_POSTS_BY_TAG_FAILURE, tag, message };
}

/*--------- REDUCER ---------*/
export function getPostsByTagReducer(state, action) {
  switch (action.type) {
    case GET_POSTS_BY_TAG_BEGIN: {
      if (!state.tagStatus[action.tag]) {
        return update(state, {
          tagStatus: { [action.tag]: { $set: {
            loading: true,
            finished: false,
          }}},
        });
      }

      return update(state, {
        tagStatus: { [action.tag]: {
          loading: { $set: true },
        }},
      });
    }
    case GET_POSTS_BY_TAG_SUCCESS: {
      const { tag, page, result } = action;

      const newPosts = {};
      const postByTag = [];
      let tagTable = {};
      if (page !== 1) {
        tagTable = Object.assign({}, state.relatedTags || {});
      }
      result.posts.forEach(post => {
        const key = getPostKey(post);
        if (!state.posts[key]) { // only update non-existing post (preventing race-condition with getPost)
          newPosts[key] = post;
        }
        postByTag.push(key);

        post.tags.forEach(relatedTag => {
          if (tag !== relatedTag) {
            tagTable[relatedTag] = (tagTable[relatedTag] || 0) + 1
          }
        })
      });

      console.log(state.relatedTags, tagTable);

      let pushOrSet = { $push: postByTag };
      if (!state.tagPosts[tag] || page === 1) {
        pushOrSet = { $set: postByTag }
      }

      const newState = {
        posts: { $merge: newPosts },
        tagPosts: { [tag]: pushOrSet },
        tagStatus: { [tag]: {
          loading: { $set: false },
          finished: { $set: result.posts.length === 0 },
          error: { $set: false },
        }},
        relatedTags: { $set: tagTable },
      }

      if (result.total_count && result.total_payout) {
        newState.tagStatus[tag].total_count = { $set: result.total_count }
        newState.tagStatus[tag].total_payout = { $set: result.total_payout }
      }

      return update(state, newState);
    }
    case GET_POSTS_BY_TAG_FAILURE: {
      return update(state, {
        tagStatus: { [action.tag]: {
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
function* getPostsByTag({ tag, page }) {
  try {
    const result = yield api.get(`/posts/tag/${tag}`, { page: page, sort: getSortOption('tag') });

    yield put(getPostsByTagSuccess(tag, page, result));
  } catch(e) {
    yield put(getPostsByTagFailure(tag, e.message));
    
  }
}

export default function* getPostsByTagManager() {
  yield takeEvery(GET_POSTS_BY_TAG_BEGIN, getPostsByTag);
}
