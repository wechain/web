import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { Spin } from 'antd';
import PostList from 'features/Post/PostList';
import InfiniteScroll from 'components/InfiniteScroll';
import { selectDailyLoadingStatus } from 'features/Post/selectors';

class HuntedList extends Component {
  static propTypes = {
    dailyLoadingStatus: PropTypes.object.isRequired,
  };

  constructor() {
    super();
    this.state = {
      daysAgoArray: [-1],
    };
  }

  addMorePostList = () => {
    const maxPage = Math.max(...this.state.daysAgoArray);
    this.setState({
      daysAgoArray: this.state.daysAgoArray.concat([maxPage + 1]),
    });
  };

  render() {
    const { dailyLoadingStatus } = this.props;
    const { daysAgoArray } = this.state;
    const maxPage = Math.max(...daysAgoArray);

    const items = daysAgoArray.map((daysAgo) =>
      <PostList key={daysAgo} daysAgo={daysAgo} />
    )

    return (
      <InfiniteScroll
        loadMore={this.addMorePostList}
        hasMore={dailyLoadingStatus[maxPage] === 'done' || dailyLoadingStatus[maxPage] === 'finished'}
        isLoading={dailyLoadingStatus[maxPage] === 'loading'}
        loader={<Spin className="center-loading" key={0} />}
        useWindow={false}
      >
        {items}
      </InfiniteScroll>
    );
  }
}

const mapStateToProps = () => createStructuredSelector({
  dailyLoadingStatus: selectDailyLoadingStatus(),
});

export default connect(mapStateToProps, null)(HuntedList);
