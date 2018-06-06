import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import { Button, Select } from 'antd';
import { selectPosts, selectDailyRanking } from './selectors';
import { getPostsBegin } from './actions/getPosts';
import { daysAgoToString } from 'utils/date';
import PostItem from './components/PostItem';
import { formatAmount } from "utils/helpers/steemitHelpers";
import { timeUntilMidnightSeoul } from 'utils/date';
import { getSortOption, setSortOption } from 'utils/sortOptions';
import { isModerator } from 'features/User/utils';
import { selectMe } from 'features/User/selectors';

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
      timer: null,
      showAll: false,
    }

    if (props.daysAgo === 0) {
      this.state['showAll'] = true;
    }
  }

  componentDidMount() {
    this.props.getPosts(this.props.daysAgo);
    this.interval = setInterval(this.tick, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  tick = () => {
    const timeLeft = timeUntilMidnightSeoul(true)

    if (timeLeft === '00:00:00') {
      this.setState({ timer: (<div>Today's ranking competition is finished. Please <a onClick={() => window.location.reload()}>refresh your page.</a></div>) });
      clearInterval(this.interval);
    } else {
      this.setState({ timer: (<div><b>{timeLeft}</b> left till midnight (KST)</div>) });
    }
  }

  showAll = () => this.setState({ showAll: true });

  handleSortOption = (value) => {
    setSortOption('daily', value);
    window.location.reload();
  }

  render() {
    const { me, posts, dailyRanking, daysAgo } = this.props;

    let ranking = dailyRanking[daysAgo] || [];
    if (isEmpty(ranking) && daysAgo !== 0) {
      return null;
    }

    let dailyTotalReward = 0;
    const rankingItems = ranking.map((postKey, index) => {
      const post = posts[postKey];
      dailyTotalReward += post.payout_value;
      return (
        <PostItem key={post.id} rank={index + 1} post={post} />
      );
    });

    let buttonClass = 'show-all';
    if (this.state.showAll) {
      buttonClass += ' hide';
    }

    return (
      <div className={`post-list day-ago-${daysAgo}`}>
        <div className="heading left-padded">
          <h3>{daysAgoToString(daysAgo)}</h3>
          <div className="heading-sub">
            <b>{ranking.length}</b> products, <b>{formatAmount(dailyTotalReward)}</b> SBD hunter’s rewards were generated.<br/>
            {daysAgo === 0 && this.state.timer }
          </div>
          {daysAgo === 0 &&
            <div className="sort-option">
              <span className="text-small">Sort by: </span>
              <Select size="small" defaultValue={getSortOption('daily')} onChange={this.handleSortOption}>
                <Select.Option value="payout">Payout</Select.Option>
                <Select.Option value="created">New</Select.Option>
                <Select.Option value="vote_count">Vote Count</Select.Option>
                <Select.Option value="comment_count">Comment Count</Select.Option>
                {isModerator(me) &&
                  <Select.Option value="unverified">Unverified</Select.Option>
                }
              </Select>
            </div>
          }
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
