import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import isEmpty from 'lodash/isEmpty';
import { Helmet } from 'react-helmet';
import CircularProgress from 'components/CircularProgress';
import { scrollTop } from 'utils/scroller';
import { formatNumber } from 'utils/helpers/steemitHelpers';
import { selectRelatedTags } from 'features/Post/selectors';
import { getTagPath } from 'features/Post/utils';
import { Link } from 'react-router-dom';

class Tag extends Component {
  static propTypes = {
    relatedTags: PropTypes.object.isRequired,
  };

  renderRelatedTags(relatedTags) {

    const tagArray = Object.keys(relatedTags).map((key, index) => {
      return [relatedTags[key], key]
    }).sort((a, b) => b[0] - a[0])

    return tagArray.map((tag, index) => {
      return (
        <div className={""} style={{
          maxWidth: '30%',
          margin: '0 auto'
        }} key={tag[1]}>
          <Link to={getTagPath(tag[1])}>#{tag[1]} ({tag[0]})</Link>
          <hr/>
        </div>
      )
    })
  }

  render() {
    console.log('rendered=========================');
    console.log('rendered=========================');
    console.log('rendered=========================');
    const { tag } = this.props.match.params;

    if (isEmpty(tag)) {
      return <CircularProgress />;
    }

    return (
      <div className="profile diagonal-split-view">
        <Helmet>
          <title>#{tag} - Steemhunt</title>
        </Helmet>
        <div className="top-container primary-gradient">
          <h1>#{tag}</h1>
        </div>
        <div className="diagonal-line"></div>
        <div className="bottom-container">
          <h3>Related Tags</h3>
          {this.props.relatedTags.length}
          {this.renderRelatedTags(this.props.relatedTags)}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => createStructuredSelector({
  relatedTags: selectRelatedTags(),
});

const mapDispatchToProps = (dispatch, props) => ({
  
});

export default connect(mapStateToProps, mapDispatchToProps)(Tag);
