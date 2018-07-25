import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import isEmpty from 'lodash/isEmpty';
import { Helmet } from 'react-helmet';
import CircularProgress from 'components/CircularProgress';
import { selectRelatedTags } from 'features/Post/selectors';
import { getTagPath } from 'features/Post/utils';
import { Link } from 'react-router-dom';

class RelatedTag extends Component {
  static propTypes = {
    relatedTags: PropTypes.object.isRequired,
  };

  renderRelatedTags(relatedTags) {

    const tagArray = Object.keys(relatedTags).map((key, index) => {
      return [relatedTags[key], key]
    }).sort((a, b) => b[0] - a[0]);

    let max = 1;
    let min = 0;
    for (let tag of tagArray) {
      if (tag[0] > max) {
        max = tag[0];
      }

      if (tag[0] < min) {
        min = tag[0];
      }
    }

    let sizePerCount = 20 / (max - min);
    if (max === 1) {
      sizePerCount = 6;
    }

    return tagArray.slice(0, 20).map((tag, index) => {
      return (
        <div className="tag" key={tag[1]}>
          <Link to={getTagPath(tag[1])} style={{fontSize: 11 + tag[0] * sizePerCount + 'px'}}>#{tag[1]} ({tag[0]})</Link>
        </div>
      );
    })
  }

  render() {
    const { tag } = this.props.match.params;

    if (isEmpty(tag)) {
      return <CircularProgress />;
    }

    return (
      <div className="tags diagonal-split-view">
        <Helmet>
          <title>#{tag} - Steemhunt</title>
        </Helmet>
        <div className="top-container primary-gradient">
          <h1>#{tag}</h1>
        </div>
        <div className="diagonal-line"></div>
        <div className="bottom-container">
          <h1 className="related-tags">Related Tags</h1>
          {this.renderRelatedTags(this.props.relatedTags)}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => createStructuredSelector({
  relatedTags: selectRelatedTags(),
});

export default connect(mapStateToProps)(RelatedTag);
