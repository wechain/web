import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import isEmpty from 'lodash/isEmpty';
import { Helmet } from 'react-helmet';
import CircularProgress from 'components/CircularProgress';
import { selectRelatedTags, selectTagStatus } from 'features/Post/selectors';
import { getTagPath } from 'features/Post/utils';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import { COLOR_LIGHT_GREY } from 'styles/constants';

class RelatedTag extends Component {
  static propTypes = {
    relatedTags: PropTypes.object.isRequired,
    tagStatus: PropTypes.object.isRequired,
  };

  renderRelatedTags(relatedTags) {

    const tagArray = Object.keys(relatedTags).map((key, index) => {
      return [relatedTags[key], key]
    }).sort((a, b) => b[0] - a[0]);

    return tagArray.slice(0, 20).map((tag, index) => {
      return (
        <div className="tag" key={tag[1]}>
          <Link to={getTagPath(tag[1])}>
            <Button size={'small'}>#{tag[1]} ({tag[0]})</Button>
          </Link>
        </div>
      );
    })
  }

  render() {
    const { tag } = this.props.match.params;

    if (isEmpty(tag)) {
      return <CircularProgress />;
    }

    const { tagStatus } = this.props;

    const profileStyle = {
      backgroundColor: COLOR_LIGHT_GREY,
      backgroundSize: 'cover',
      backgroundImage: `${tagStatus[tag] && tagStatus[tag].featuredImage ? `url(${tagStatus[tag].featuredImage})` : 'none'}`,
    };

    return (
      <div className="tags diagonal-split-view">
        <Helmet>
          <title>#{tag} - Steemhunt</title>
        </Helmet>
        <div className="top-container primary-gradient">
          <h1>#{tag}</h1>
          <h3>{tagStatus[tag] && tagStatus[tag].total_count || 0} Hunts</h3>
        </div>
        <div className="diagonal-line"></div>
        <div className="bottom-container">
          <div className="profile-picture" style={profileStyle}></div>
          <h2 className="related-tags">Related Tags</h2>
          {this.renderRelatedTags(this.props.relatedTags)}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => createStructuredSelector({
  relatedTags: selectRelatedTags(),
  tagStatus: selectTagStatus(),
});

export default connect(mapStateToProps)(RelatedTag);
