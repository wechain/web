import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { Spin, Select } from 'antd';
import InfiniteScroll from 'components/InfiniteScroll';
import { selectCategoryStatus, selectCategoryPosts, selectPosts, selectCurrentCategory } from 'features/Post/selectors';
import { getPostsByCategoryBegin } from 'features/Post/actions/getPostsByCategory';
import { setCurrentCategoryBegin } from 'features/Post/actions/setCurrentCategory';
import PostItem from 'features/Post/components/PostItem';
import { formatAmount } from "utils/helpers/steemitHelpers";
import { getSortOption, setSortOption } from 'utils/sortOptions';

class CategoryList extends Component {
  static propTypes = {
    currentCategory: PropTypes.string,
    categoryStatus: PropTypes.object.isRequired,
    posts: PropTypes.object.isRequired,
    categoryPosts: PropTypes.object.isRequired,
    getPostsByCategory: PropTypes.func.isRequired,
    setCurrentCategory: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const { match } = this.props;
    if (match.params.category !== this.props.currentCategory) {
      this.props.setCurrentCategory(match.params.category);
      this.props.getPostsByCategory(match.params.category, 1);
    }
    // scrollTop();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.match.params.category !== nextProps.currentCategory) {
      this.props.setCurrentCategory(nextProps.match.params.category);
      this.props.getPostsByCategory(nextProps.match.params.category, 1);
      // scrollTop();
    }
  }

  loadMore = (nextPage) => {
    this.props.getPostsByCategory(this.props.currentCategory, nextPage);
  };

  handleSortOption = (value) => {
    setSortOption('profile', value);
    this.props.getPostsByCategory(this.props.currentCategory, 1);
  };

  render() {
    const { categoryStatus, currentCategory, categoryPosts, posts } = this.props;

    const items = (categoryPosts[currentCategory] || []).map((key, index) =>
      <PostItem key={index + 1} rank={index + 1} post={posts[key]} pathPrefix={`/category/${currentCategory}`} />
    )

    let hasMore = true;
    let isLoading = false;
    if (categoryStatus[currentCategory]) {
      if (categoryStatus[currentCategory]['finished']) {
        hasMore = false;
      }

      if (categoryStatus[currentCategory]['loading']) {
        isLoading = true;
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
        header={categoryStatus[currentCategory] &&
          <div className="heading left-padded" key="header">
            <h3>Posts for "{currentCategory}"</h3>
            <div className="category-option">
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
              <b>{categoryStatus[currentCategory].total_count}</b> products, <b>{formatAmount(categoryStatus[currentCategory].total_payout)}</b> SBD hunter’s rewards were generated.
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
  currentCategory: selectCurrentCategory(),
  categoryStatus: selectCategoryStatus(),
  posts: selectPosts(),
  categoryPosts: selectCategoryPosts(),
});


const mapDispatchToProps = dispatch => ({
  getPostsByCategory: (category, page) => dispatch(getPostsByCategoryBegin(category, page)),
  setCurrentCategory: category => dispatch(setCurrentCategoryBegin(category)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CategoryList);
