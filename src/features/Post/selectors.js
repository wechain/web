import { createSelector } from 'reselect';
import { selectCommentsDomain } from 'features/Comment/selectors';
import { generatePostKey } from './utils';
import { selectMe } from 'features/User/selectors';

const selectPostDomain = () => state => state.post;

export const selectDraft = () => createSelector(
  selectPostDomain(),
  state => state.draft,
);

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
    if (!me || !dailyRanking[0]) {
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

export const selectTagStatus = () => createSelector(
  selectPostDomain(),
  state => state.tagStatus,
)

export const selectTagPosts = () => createSelector(
  selectPostDomain(),
  state => state.tagPosts,
)