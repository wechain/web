import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import isEmpty from 'lodash/isEmpty';
import { Helmet } from 'react-helmet';
import CircularProgress from 'components/CircularProgress';
import { scrollTop } from 'utils/scroller';
import { formatNumber } from 'utils/helpers/steemitHelpers';

class Tag extends Component {

  componentDidMount() {
  }

  componentWillReceiveProps(nextProps) {
  }

  render() {
    const { tag } = this.props.match.params;

    if (isEmpty(tag)) {
      return <CircularProgress />;
    }

    return (
      <div className="profile diagonal-split-view">
        <Helmet>
          <title>{tag} - Steemhunt</title>
        </Helmet>
        <div className="top-container primary-gradient" style={{
            display: 'flex',
            height: '100vh',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
          <h1>{tag}</h1>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => createStructuredSelector({
 
});

const mapDispatchToProps = (dispatch, props) => ({
  
});

export default connect(mapStateToProps, mapDispatchToProps)(Tag);
