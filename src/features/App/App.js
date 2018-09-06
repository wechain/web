import React, { Component } from 'react';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import isEmpty from 'lodash/isEmpty';
import { Helmet } from 'react-helmet';
import { selectAppProps } from './selectors';
import { getAppConfigBegin } from './actions/getAppConfig';
import { RoutesLeft, RoutesRight } from 'Routes';
import Referral from './Referral';

import 'custom.css';

class App extends Component {

  constructor(props) {
    super(props);
    this.params = new URLSearchParams(this.props.location.search);
    this.state = {
      showBanner: this.params.get('ref') !== null
    }
  }

  componentDidMount() {
    if (isEmpty(this.props.appProps)) {
      this.props.getAppConfig();
    }
  }

  setBannerState = async (showBanner) => await this.setState({ showBanner })

  render() {
    return (
      <div id="app-container" className="app-container">
        <Helmet>
          <title>Steemhunt - Dig Products, Earn STEEMs</title>
        </Helmet>
        {this.params.get('ref') && this.state.showBanner && <Referral params={this.params} pathname={this.props.location.pathname} setBannerState={this.setBannerState} />}
        <div className={`split-container${this.params.get('ref') && this.state.showBanner ? ' with-banner' : ''}`}>
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
