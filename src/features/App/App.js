import React, { Component } from 'react';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import isEmpty from 'lodash/isEmpty';
import { Helmet } from 'react-helmet';
import { selectAppProps } from './selectors';
import { getAppConfigBegin } from './actions/getAppConfig';
import { RoutesLeft, RoutesRight } from 'Routes';
import { isPrerenderer } from 'utils/userAgent';

import 'custom.css';

class App extends Component {

  componentDidMount() {
    if (isEmpty(this.props.appProps) && !isPrerenderer()) {
      this.props.getAppConfig();
    }
  }

  render() {
    return (
      <div id="app-container" className="app-container">
        <Helmet>
          <title>Steemhunt - Dig Products, Earn STEEMs</title>
          { /* Search Engine */ }
          <meta name="description" content="Daily ranking of effortlessly cool products fueled by STEEM blockchain" />
          <meta name="image" content={`${process.env.PUBLIC_URL}/og-image-1200.png`} />
          { /* Schema.org for Google */ }
          <meta itemprop="name" content="Steemhunt - Dig Products, Earn STEEMs" />
          <meta itemprop="description" content="Daily ranking of effortlessly cool products fueled by STEEM blockchain" />
          <meta itemprop="image" content={`${process.env.PUBLIC_URL}/og-image-1200.png`} />
          { /* Twitter */ }
          <meta name="twitter:card" content="summary" />
          <meta name="twitter:title" content="Steemhunt - Dig Products, Earn STEEMs" />
          <meta name="twitter:description" content="Daily ranking of effortlessly cool products fueled by STEEM blockchain" />
          <meta name="twitter:image:src" content={`${process.env.PUBLIC_URL}/og-image-1024.png`} />
          { /* Open Graph general (Facebook, Pinterest & Google+) */ }
          <meta property="og:title" content="Steemhunt - Dig Products, Earn STEEMs" />
          <meta property="og:description" content="Daily ranking of effortlessly cool products fueled by STEEM blockchain" />
          <meta property="og:image" content={`${process.env.PUBLIC_URL}/og-image-1200.png`} />
          <meta property="og:url" content={process.env.PUBLIC_URL} />
          <meta property="og:site_name" content="Steemhunt" />
          <meta property="og:type" content="website" />
        </Helmet>
        <div className="split-container">
          <RoutesLeft />
          <RoutesRight />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => createStructuredSelector({
  appProps: selectAppProps()
});

const mapDispatchToProps = (dispatch, props) => ({
  getAppConfig: () => dispatch(getAppConfigBegin()),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
