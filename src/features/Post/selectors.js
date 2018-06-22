import { createSelector } from 'reselect';
import { selectCommentsDomain } from 'features/Comment/selectors';
import { generatePostKey } from './utils';
import { selectMe } from 'features/User/selectors';
import { updateDraft } from './actions/updateDraft';
import store from '../../store';

const selectPostDomain = () => state => state.post;

export const selectDraft = () => {
  const draftString = localStorage.getItem('draft');
  if(!!draftString) {
    const draft = JSON.parse(draftString);
    store.dispatch(updateDraft('url', draft.url || '#'));
    store.dispatch(updateDraft('title', draft.title || 'Title'));
    store.dispatch(updateDraft('tagline', draft.tagline || 'Short Description'));
    store.dispatch(updateDraft('description', draft.description || ''));
    store.dispatch(updateDraft('images', draft.images || []));
    store.dispatch(updateDraft('tags', draft.tags || []));
    store.dispatch(updateDraft('beneficiaries', draft.beneficiaries || []))
  }
  return createSelector(
    selectPostDomain(),
    state => state.draft,
  )
};

export const selectIsPublishing = () => createSelector(
  selectPostDomain(),
  state => state.isPublishing,
);

export const selectPosts = () => createSelector(
  selectPostDomain(),
  state => state.posts,
);

export const selectDailyRanking = () => createSelector(
  selectPostDomain(),
  state => state.dailyRanking,
);

export const selectMyPostsCountToday = () => createSelector(
  [selectMe(), selectDailyRanking()],
  (me, dailyRanking) => {
    if (!dailyRanking[0]) {
      return 0;
    }

    const regex = new RegExp(`^${me}/`);
    return dailyRanking[0].filter(permlink => permlink.match(regex)).length
  }
);

export const selectAuthorPosts = () => createSelector(
  selectPostDomain(),
  state => state.authorPosts,
);

export const selectTopPosts = () => createSelector(
  selectPostDomain(),
  state => state.topPosts,
);

export const selectIsPostLoading = () => createSelector(
  selectPostDomain(),
  state => state.isPostLoading,
);

export const selectIsLoading = () => createSelector(
  selectPostDomain(),
  state => state.isLoading,
);

export const selectAuthorStatus = () => createSelector(
  selectPostDomain(),
  state => state.authorStatus,
);

export const selectTopStatus = () => createSelector(
  selectPostDomain(),
  state => state.topStatus,
);

export const selectCurrentPost = () => createSelector(
  selectPostDomain(),
  state => state.posts[state.currentPostKey],
);

export const selectPostByKey = (key) => createSelector(
  selectPosts(),
  posts => posts[key],
);

export const selectSearchTerm = () => createSelector(
  selectPostDomain(),
  state => state.searchTerm,
);

export const selectSearchResult = () => createSelector(
  selectPostDomain(),
  state => state.searchResult,
);

export const selectIsSearching = () => createSelector(
  selectPostDomain(),
  state => state.isSearching,
);

export const selectCurrentComments = () => createSelector(
  [selectCurrentPost(), selectCommentsDomain()],
  (currentPost, commentsDomain) => {
    return currentPost ? commentsDomain.commentsFromPost[generatePostKey(currentPost.author, currentPost.permlink)] : {};
  }
);
