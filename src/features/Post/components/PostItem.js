import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Link } from 'react-router-dom';
import { Icon } from 'antd';
import { selectMe } from 'features/User/selectors';
import { getPostPath, getThumbnail } from '../utils';
import { isModerator } from 'features/User/utils';
import VoteButton from 'features/Vote/VoteButton';
import { formatAmount } from 'utils/helpers/steemitHelpers';

class PostItem extends Component {
  static propTypes = {
    pathPrefix: PropTypes.string,
    rank: PropTypes.number.isRequired,
    post: PropTypes.object.isRequired,
  };

  render() {
    const { me, rank, post, pathPrefix } = this.props;
    const activeVotes = post.active_votes.filter(v => v.percent !== 0).length;

    return (
      <div className={`post${rank === 1 ? ' top-border' : ''}${post.is_active ? '' : ' faded'}`}>
        <div className="rank">{rank}</div>
        <Link to={getPostPath(post, pathPrefix)}>
          <img src={post.images && getThumbnail(post.images[0].link, 240, 240)} alt={post.title} className="thumbnail"/>
        </Link>
        <div className="summary">
          <div className="title">
            <Link to={getPostPath(post, pathPrefix)}>{post.title}</Link>
            {isModerator(me) &&
              (post.is_verified ?
                <Icon type="check-circle" className="verified"/>
              :
                (post.verified_by &&
                  <Icon type="loading" className="verified"/>
                )
              )
            }
          </div>
          <div className="tagline">{post.tagline}</div>
          <div className="stats">
            <span className="payout">{formatAmount(post.payout_value)}</span>
            <span className="spacer">&middot;</span>
            {activeVotes} votes and {post.children} comments
          </div>
        </div>
        <div className="vote-section">
          <VoteButton post={post} type="post" layout="list" />
        </div>
      </div>
    )
  }
}


const mapStateToProps = () => createStructuredSelector({
  me: selectMe(),
});

export default connect(mapStateToProps)(PostItem);
