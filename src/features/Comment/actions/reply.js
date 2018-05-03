import { put, select, takeLatest } from 'redux-saga/effects';
import update from 'immutability-helper';
import { notification } from 'antd';
import { createCommentPermlink } from 'utils/helpers/steemitHelpers';
import { selectMyAccount } from 'features/User/selectors';
import { toCustomISOString } from'utils/date';
import steemConnectAPI from 'utils/steemConnectAPI';
import { postIncreaseCommentCount } from 'features/Post/actions/refreshPost';
import { selectCurrentPost } from 'features/Post/selectors';
import api from 'utils/api';
import { extractErrorMessage } from 'utils/errorMessage';

/*--------- CONSTANTS ---------*/
const REPLY_BEGIN = 'REPLY_BEGIN';
const REPLY_SUCCESS = 'REPLY_SUCCESS';
const REPLY_EDIT_SUCCESS = 'REPLY_EDIT_SUCCESS';
const REPLY_FAILURE = 'REPLY_FAILURE';
const ADD_COMMENTS_FROM_POST = 'ADD_COMMENTS_FROM_POST';

/*--------- ACTIONS ---------*/
export function replyBegin(parent, body, editMode) {
  return { type: REPLY_BEGIN, parent, body, editMode };
}

function replySuccess(parent, tempId, replyObj) {
  return { type: REPLY_SUCCESS, parent, tempId, replyObj };
}

function replyEditSuccess(id, body) {
  return { type: REPLY_EDIT_SUCCESS, id, body };
}

function replyFailure(message) {
  return { type: REPLY_FAILURE, message };
}

function addCommentsFromPosts(parent, tempId) {
  return { type: ADD_COMMENTS_FROM_POST, parent, tempId };
}

/*--------- REDUCER ---------*/
export function replyReducer(state, action) {
  switch (action.type) {
    case REPLY_BEGIN: {
      return update(state, {
        isPublishing: { $set: true },
        hasSucceeded: { $set: false },
      });
    }
    case ADD_COMMENTS_FROM_POST: {
      const { parent, tempId } = action;
      return update(state, {
        commentsFromPost: {
          [`${parent.author}/${parent.permlink}`]: {
            list: { $push: [tempId] }
          },
        }
      });
    }
    case REPLY_SUCCESS: {
      const { parent, tempId, replyObj } = action;

      return update(state, {
        commentsData: {
          [tempId]: { $set: replyObj },
        },
        commentsChild: {
          [parent.id]: { $autoArray: { $push: [tempId] } },
        },
        isPublishing: { $set: false },
        hasSucceeded: { $set: true },
      });
    }
    case REPLY_EDIT_SUCCESS: {
      const { id, body } = action;

      return update(state, {
        commentsData: {
          [id]: { body: { $set: body } },
        },
        isPublishing: { $set: false },
        hasSucceeded: { $set: true },
      });
    }
    case REPLY_FAILURE: {
      return update(state, {
        isPublishing: { $set: false },
      });
    }
    default:
      return state;
  }
}

/*--------- SAGAS ---------*/
function* reply({ parent, body, editMode }) {
  try {
    const myAccount = yield select(selectMyAccount());

    if (editMode) {
      yield steemConnectAPI.comment(
        parent.parent_author,
        parent.parent_permlink,
        parent.author,
        parent.permlink,
        '',
        body,
        parent.json_metadata,
      );

      yield put(replyEditSuccess(parent.id, body));
    } else {
      const permlink = createCommentPermlink(parent.author, parent.permlink);
      const tempId = Math.floor((Math.random() * 1000000) + 1);
      const json_metadata = {
        tags: [ 'steemhunt' ],
        community: 'steemhunt',
        app: 'steemhunt/1.0.0',
      };
      const now = toCustomISOString(new Date());
      const cashoutTime = toCustomISOString(new Date(Date.now() + 604800));

      const replyObj = {
        id: tempId,
        author: myAccount.name,
        parent_author: parent.author,
        parent_permlink:  parent.permlink,
        permlink,
        body,
        json_metadata,
        created: now,
        last_update: now,
        active_votes: [],
        cashout_time: cashoutTime,
        net_votes: 0,
        author_reputation: myAccount.reputation,
      };

      yield steemConnectAPI.comment(
        parent.author,
        parent.permlink,
        myAccount.name,
        permlink,
        '',
        body,
        json_metadata,
      );

      // If parent is a post
      if (!parent.parent_author) {
        yield put(addCommentsFromPosts(parent, tempId));
      }

      // Update children counter on local & DB
      const post = yield select(selectCurrentPost());
      yield api.increaseCommentCount(post);
      yield put(postIncreaseCommentCount(post));

      yield put(replySuccess(parent, tempId, replyObj));
    }
  } catch (e) {
    yield notification['error']({ message: extractErrorMessage(e) });
    yield put(replyFailure(e.message));
  }
}

export default function* replyManager() {
  yield takeLatest(REPLY_BEGIN, reply);
}
