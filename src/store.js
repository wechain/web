import { applyMiddleware, compose, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import createBrowserHistory from 'history/createBrowserHistory';
import createMemoryHistory from 'history/createMemoryHistory';
import rootReducer from 'reducers';
import sagas from './sagas';

export const history = typeof window !== 'undefined' ? createBrowserHistory() : createMemoryHistory();
const sagaMiddleware = createSagaMiddleware();

// localStorage update
// https://stackoverflow.com/questions/35305661/where-to-write-to-localstorage-in-a-redux-app

const localStorageMiddleware = ({getState}) => {
  return (next) => (action) => {
    const result = next(action);

    switch(action.type) {
      case 'UPDATE_DRAFT':
        // update draft
        const draft = getState().post.draft;
        localStorage.setItem('draft', JSON.stringify(draft));
        break;
      case 'PUBLISH_CONTENT_SUCCESS':
        // clear localStorage 'draft'
        localStorage.removeItem('draft');
        break;
      default:
        break;
    }
    return result;
  }
}

const initialState = {};
const enhancers = [];
const middlewares = [
  sagaMiddleware,
  localStorageMiddleware,
];

if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  const devToolsExtension = window.devToolsExtension;
  if (typeof devToolsExtension === 'function') {
    enhancers.push(devToolsExtension());
  }

  const { logger } = require(`redux-logger`);
  middlewares.push(logger);
}

const composedEnhancers = compose(
  applyMiddleware(...middlewares),
  ...enhancers
);

const store = createStore(
  rootReducer,
  initialState,
  composedEnhancers
);

sagas.forEach(saga => sagaMiddleware.run(saga));

export default store;
