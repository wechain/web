import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import isEmpty from 'lodash/isEmpty';
import { Helmet } from 'react-helmet';
import { selectMyAccount } from 'features/User/selectors';
import { toTimeAgo } from 'utils/date';
import CircularProgress from 'components/CircularProgress';

class Wallet extends Component {
  static propTypes = {
    myAccount: PropTypes.object.isRequired,
  };

  componentDidMount() {
  }

  componentWillReceiveProps(nextProps) {
  }

  render() {
    const { myAccount } = this.props;
    if (isEmpty(myAccount)) {
      return <CircularProgress />;
    }

    return (
      <div className="wallet">
        <Helmet>
          <title>@{myAccount.name} - Steemhunt</title>
        </Helmet>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => createStructuredSelector({
  myAccount: selectMyAccount(),
});

const mapDispatchToProps = (dispatch, props) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(Wallet);
