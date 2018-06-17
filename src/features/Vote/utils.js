// FIXME: Handle down votes
export const manageContentVote = (content, weight, accountName) => {
  if (weight > 0) {
    // VOTE
    content.active_votes.push({
      voter: accountName,
      percent: weight,
    });

    if (!content.parent_author) {
      content.valid_votes.push({
        voter: accountName,
        percent: weight,
      });
    }
  } else {
    // UNVOTE
    content.active_votes = content.active_votes.filter(vote => {
      return vote.voter !== accountName && vote.percent > 0;
    });

    if (!content.parent_author) {
      content.valid_votes = content.valid_votes.filter(vote => {
        return vote.voter !== accountName && vote.percent > 0;
      });
    }
  }
  return content;
};