import React, { Component } from 'react';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import last from 'lodash/last';
import { Spin } from 'antd';
import PostList from 'features/Post/PostList';
import InfiniteScroll from 'components/InfiniteScroll';
import { selectIsLoading } from 'features/Post/selectors';
import { getSortOption } from 'utils/sortOptions';

class HuntedList extends Component {
  constructor() {
    super();
    this.state = {
      daysAgoArray: [0],
    };
  }

  addMorePostList = () => {
    const maxPage = Math.max(...this.state.daysAgoArray);
    this.setState({
      daysAgoArray: this.state.daysAgoArray.concat([maxPage + 1]),
    });
  };

  render() {
    const { daysAgoArray } = this.state;

    const genesis = (new Date('2018-02-16')).getTime();
    const oldest = Date.now() - last(daysAgoArray) * 86400000;
    let hasMore = oldest > genesis;

    if (this.state.daysAgoArray.length > 3 && getSortOption('daily') === 'unverified') {
      hasMore = false;
    }

    const items = daysAgoArray.map((daysAgo) =>
      <PostList key={daysAgo} daysAgo={daysAgo} />
    )

    return (
      <InfiniteScroll
        loadMore={this.addMorePostList}
        hasMore={hasMore}
        isLoading={this.props.isLoading}
        loader={<Spin className="center-loading" key={0} />}
        useWindow={false}
      >
        {items}
      </InfiniteScroll>
    );
  }
}

const mapStateToProps = () => createStructuredSelector({
  isLoading: selectIsLoading(),
});

export default connect(mapStateToProps, null)(HuntedList);
