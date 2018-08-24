import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { Spin } from 'antd';
import PostList from 'features/Post/PostList';
import InfiniteScroll from 'components/InfiniteScroll';
import { selectIsLoading, selectError } from 'features/Post/selectors';

class HuntedList extends Component {
  static propTypes = {
    isLoading: PropTypes.bool.isRequired,
    error: PropTypes.bool.isRequired,
  };

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
    const { isLoading, error } = this.props;
    const { daysAgoArray } = this.state;

    if (error) {
      return (
        <div className="heading left-padded right-padded">
          Service is temporarily unavailable, Please try again later.
        </div>
      );
    }

    const items = daysAgoArray.map((daysAgo) =>
      <PostList key={daysAgo} daysAgo={daysAgo} />
    )

    return (
      <InfiniteScroll
        loadMore={this.addMorePostList}
        hasMore={true}
        isLoading={isLoading}
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
  error: selectError(),
});

export default connect(mapStateToProps, null)(HuntedList);
