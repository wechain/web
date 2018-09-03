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

  renderRelatedTags = (array = false) => {
    const tagArray = Object.keys(this.props.relatedTags).map((key, index) => {
      return [this.props.relatedTags[key], key];
    }).sort((a, b) => b[0] - a[0]);

    if (array) {
      return tagArray.map(x => `#${x[1]}`).slice(0, 20);
    }

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

    const mainImage = tagStatus[tag] && tagStatus[tag].featuredImage ? `${tagStatus[tag].featuredImage}` : null;
    const profileStyle = {
      backgroundColor: COLOR_LIGHT_GREY,
      backgroundSize: 'cover',
      backgroundImage: `${mainImage ? `url(${mainImage})` : 'none'}`,
    };

    const relatedTagsString = this.renderRelatedTags(true).join(', ');

    return (
      <div className="tags diagonal-split-view">
        <Helmet>
          <title>#{tag} - Steemhunt</title>

          { /* Search Engine */ }
          <meta name="description" content={`Related tags: ${relatedTagsString}`} />
          <meta name="image" content={mainImage} />
          { /* Schema.org for Google */ }
          <meta itemprop="name" content={`#${tag} - Steemhunt`} />
          <meta itemprop="description" content={`Related tags: ${relatedTagsString}`} />
          <meta itemprop="image" content={mainImage} />
          { /* Twitter */ }
          <meta name="twitter:title" content={`@${tag} - Steemhunt`} />
          <meta name="twitter:description" content={`Related tags: ${relatedTagsString}`} />
          <meta name="twitter:image:src" content={mainImage} />
          { /* Open Graph general (Facebook, Pinterest & Google+) */ }
          <meta name="og:title" content={`@${tag} - Steemhunt`} />
          <meta name="og:description" content={`Related tags: ${relatedTagsString}`} />
          <meta name="og:image" content={mainImage} />
        </Helmet>
        <div className="top-container primary-gradient">
          <h1>#{tag}</h1>
          <h3>{tagStatus[tag] && (tagStatus[tag].total_count || 0)} Hunts</h3>
        </div>
        <div className="diagonal-line"></div>
        <div className="bottom-container">
          <div className="profile-picture" style={profileStyle}></div>
          <h2 className="related-tags">Related Tags</h2>
          {this.renderRelatedTags()}
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
