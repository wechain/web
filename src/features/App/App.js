import React, { Component } from 'react';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import isEmpty from 'lodash/isEmpty';
import { Helmet } from 'react-helmet';
import { selectAppProps } from './selectors';
import { getAppConfigBegin } from './actions/getAppConfig';
import { RoutesLeft, RoutesRight } from 'Routes';
import AppModal from './AppModal';

import 'custom.css';

class App extends Component {

  componentDidMount() {
    if (isEmpty(this.props.appProps)) {
      this.props.getAppConfig();
    }
  }

  render() {
    return (
      <div id="app-container" className="app-container">
        <Helmet>
          <title>Steemhunt - Dig Products, Earn STEEMs</title>
        </Helmet>
        <div className="split-container">
          <RoutesLeft />
          <RoutesRight />
        </div>
        <AppModal location={this.props.location} />
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
