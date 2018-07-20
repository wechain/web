import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { Spin, Select } from 'antd';
import InfiniteScroll from 'components/InfiniteScroll';
import { selectTagStatus, selectTagPosts, selectPosts } from 'features/Post/selectors';
import { getPostsByTagBegin } from 'features/Post/actions/getPostsByTag';
import PostItem from 'features/Post/components/PostItem';
import { formatAmount } from "utils/helpers/steemitHelpers";
import { getSortOption, setSortOption } from 'utils/sortOptions';

class TagList extends Component {
  static propTypes = {
    tagStatus: PropTypes.object.isRequired,
    posts: PropTypes.object.isRequired,
    tagPosts: PropTypes.object.isRequired,
    getPostsByTag: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.currentTag = this.props.match.params.tag;
    this.props.getPostsByTag(this.props.match.params.tag, 1);
  }

  componentWillReceiveProps(nextProps) {
    if (this.currentTag !== nextProps.match.params.tag) {
      this.currentTag = nextProps.match.params.tag;
      this.props.getPostsByTag(nextProps.match.params.tag, 1);
    }
  }

  loadMore = (nextPage) => {
    this.props.getPostsByTag(this.props.match.params.tag, nextPage);
  };

  handleSortOption = (value) => {
    setSortOption('tag', value);
    this.props.getPostsByTag(this.props.match.params.tag, 1);
  };

  render() {
    const { tagStatus, tagPosts, posts } = this.props;
    const { tag } = this.props.match.params;

    const items = (tagPosts[tag] || []).map((key, index) =>
      <PostItem key={index + 1} rank={index + 1} post={posts[key]} pathPrefix={`/tag/${tag}`} />
    )

    let hasMore = false;
    let isLoading = false;
    if (tagStatus[tag]) {
      if (!tagStatus[tag]['finished'] && !tagStatus[tag]['error']) {
        hasMore = true;
      }

      if (tagStatus[tag]['loading']) {
        isLoading = true;
      }

      if (tagStatus[tag]['error']) {
        return (
          <div className="heading left-padded right-padded">
            Service is temporarily unavailbe, Please try again later.
          </div>
        );
      }
    }

    return (
      <InfiniteScroll
        loadMore={this.loadMore}
        hasMore={hasMore}
        isLoading={isLoading}
        loader={<Spin className="center-loading" key={0} />}
        useWindow={false}
        className="post-list"
        header={tagStatus[tag] &&
          <div className="heading left-padded" key="header">
            <h3>Posts for "{tag}"</h3>
            <div className="tag-option">
              <span className="text-small">Sort by: </span>
              <Select size="small" defaultValue={getSortOption('profile')} onChange={this.handleSortOption}>
                <Select.Option value="hunt_score">Hunt Score</Select.Option>
                <Select.Option value="payout">Payout Value</Select.Option>
                <Select.Option value="created">New</Select.Option>
                <Select.Option value="vote_count">Vote Count</Select.Option>
                <Select.Option value="comment_count">Comment Count</Select.Option>
              </Select>
            </div>
            <div className="heading-sub">
              <b>{tagStatus[tag].total_count}</b> products, <b>{formatAmount(tagStatus[tag].total_payout)}</b> SBD hunter’s rewards were generated.
            </div>
          </div>
        }
      >
        {items}
      </InfiniteScroll>
    );
  }
}

const mapStateToProps = () => createStructuredSelector({
  tagStatus: selectTagStatus(),
  tagPosts: selectTagPosts(),
  posts: selectPosts(),
});

const mapDispatchToProps = dispatch => ({
  getPostsByTag: (tag, page) => dispatch(getPostsByTagBegin(tag, page)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TagList);
