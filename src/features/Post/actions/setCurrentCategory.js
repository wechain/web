import { put, select, takeLatest } from 'redux-saga/effects';
import update from 'immutability-helper';

/*--------- CONSTANTS ---------*/
const SET_CURRENT_CATEGORY_BEGIN = 'SET_CURRENT_CATEGORY_BEGIN';
const SET_CURRENT_CATEGORY_SUCCESS = 'SET_CURRENT_CATEGORY_SUCCESS';
const SET_CURRENT_CATEGORY_FAILURE = 'SET_CURRENT_CATEGORY_FAILURE';

/*--------- ACTIONS ---------*/
export function setCurrentCategoryBegin(category) {
  return { type: SET_CURRENT_CATEGORY_BEGIN, category };
}

export function setCurrentCategorySuccess() {
  return { type: SET_CURRENT_CATEGORY_SUCCESS };
}

export function setCurrentCategoryFailure(message) {
  return { type: SET_CURRENT_CATEGORY_FAILURE, message };
}

/*--------- REDUCER ---------*/
export function setCurrentCategoryReducer(state, action) {
  switch (action.type) {
    case SET_CURRENT_CATEGORY_BEGIN:
      return update(state, {
        currentCategory: {$set: action.category},
      });
    default:
      return state;
  }
}

/*--------- SAGAS ---------*/
function* setCurrentCategory({ category }) {
  try {
    yield put(setCurrentCategorySuccess());
  } catch (e) {
    yield put(setCurrentCategoryFailure(e.message));
  }
}

export default function* setCurrentCategoryManager() {
  yield takeLatest(SET_CURRENT_CATEGORY_BEGIN, setCurrentCategory);
}
