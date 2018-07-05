import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import { Button, Select, Icon, Tooltip } from 'antd';
import { selectPosts, selectDailyRanking } from './selectors';
import { getPostsBegin } from './actions/getPosts';
import { daysAgoToString } from 'utils/date';
import PostItem from './components/PostItem';
import { getSortOption, setSortOption } from 'utils/sortOptions';
import { isModerator } from 'features/User/utils';
import { selectMe } from 'features/User/selectors';
import { SubHeading } from './components/SubHeading';

class PostList extends Component {
  static propTypes = {
    me: PropTypes.string.isRequired,
    daysAgo: PropTypes.number.isRequired,
    getPosts: PropTypes.func.isRequired,
    posts: PropTypes.object.isRequired,
    dailyRanking: PropTypes.object.isRequired,
  };

  constructor(props) {
    super();

    this.state = {
      showAll: false,
    }

    if (props.daysAgo === 0) {
      this.state['showAll'] = true;
    }
  }

  componentDidMount() {
    this.props.getPosts(this.props.daysAgo);
  }

  showAll = () => this.setState({ showAll: true });

  handleSortOption = (value) => {
    setSortOption(`daily-${this.props.daysAgo}`, value);
    this.props.getPosts(this.props.daysAgo);
  }

  render() {
    const { me, posts, dailyRanking, daysAgo } = this.props;

    let ranking = dailyRanking[daysAgo] || [];
    if (isEmpty(ranking) && daysAgo !== 0) {
      return null;
    }

    let dailyTotalReward = 0;
    let rankingItems = ranking.map((postKey, index) => {
      const post = posts[postKey];
      if (post) {
        dailyTotalReward += post.payout_value;
        return (
          <PostItem key={post.id} rank={index + 1} post={post} />
        );
      }
    });

    let buttonClass = 'show-all';
    if (this.state.showAll) {
      buttonClass += ' hide';
    }

    const currentSortOption = getSortOption('daily-' + daysAgo);

    return (
      <div className={`post-list day-ago-${daysAgo}`}>
        <div className="heading left-padded">
          <h3>
            {daysAgoToString(daysAgo)}
          </h3>
          <SubHeading huntsCount={ranking.length} dailyTotalReward={dailyTotalReward} daysAgo={daysAgo}  />
          <div className="sort-option">
            <span className="text-small">Sort by: </span>
            <Select size="small" defaultValue={currentSortOption} onChange={this.handleSortOption}>
              {daysAgo === 0 &&
                <Select.Option value="random">Random</Select.Option>
              }
              <Select.Option value="hunt_score">Hunt Score</Select.Option>
              <Select.Option value="payout">Payout Value</Select.Option>
              <Select.Option value="created">New</Select.Option>
              <Select.Option value="vote_count">Vote Count</Select.Option>
              <Select.Option value="comment_count">Comment Count</Select.Option>
              {isModerator(me) &&
                <Select.Option value="unverified">Unverified</Select.Option>
              }
            </Select>
            {currentSortOption === 'hunt_score' &&
              <Tooltip placement="left" title="Hunt score is calculated by upvoting counts that are weighted by Steem reputation in order to avoid spamming attempts.">
                <Icon type="question-circle-o" className="help-hunt-score" />
              </Tooltip>
            }
          </div>
        </div>
        <div className="daily-posts">
          {rankingItems.slice(0,10)}
          {rankingItems.length > 10 &&
            <Button type="primary" size="default" className={buttonClass} ghost onClick={this.showAll}>Show All</Button>
          }
          {rankingItems.length > 10 && this.state.showAll && rankingItems.slice(10)}
        </div>
      </div>
    );
  }
}

const mapStateToProps = () => createStructuredSelector({
  me: selectMe(),
  posts: selectPosts(),
  dailyRanking: selectDailyRanking(),
});

const mapDispatchToProps = dispatch => ({
  getPosts: (daysAgo) => dispatch(getPostsBegin(daysAgo)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PostList);
