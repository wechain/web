import combine from 'utils/combine';
/*
 * EXPORTING REDUCERS and SAGAS
 */
import getPosts, { getPostsReducer } from './actions/getPosts';
import getPostsByAuthor, { getPostsByAuthorReducer } from './actions/getPostsByAuthor';
import getPost, { getPostReducer } from './actions/getPost';
import publishContent, { publishContentReducer } from './actions/publishContent';
import { updateDraftReducer } from './actions/updateDraft';
import resteem, { resteemReducer } from './actions/resteem';
import postReducer from 'features/Post/reducer';
import postRefresh, { postRefreshReducer } from './actions/refreshPost';

export const initialState = {
  draft: {
    url: '#',
    title: 'Title',
    tagline: 'Short Description',
    permlink: null,
    description: '',
    tags: [],
    images: [],
    author: null,
    active_votes: [],
    payout_value: 0,
    children: 0,
    beneficiaries: [],
  },
  posts: {},
  authorPosts: {},
  authorStatus: {},
  dailyRanking: {},
  isLoading: false,
  isPublishing: false,
  currentPostKey: null,
};

export const reducer = (state = initialState, action) => combine(
  [
    updateDraftReducer,
    getPostsReducer,
    getPostsByAuthorReducer,
    getPostReducer,
    publishContentReducer,
    postReducer,
    resteemReducer,
    postRefreshReducer,
  ],
  state,
  action,
);

// All sagas to be loaded
export default [
  getPosts,
  getPostsByAuthor,
  getPost,
  publishContent,
  resteem,
  postRefresh,
];
