import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import isEmpty from 'lodash/isEmpty';
import { List, Avatar, Button, Tooltip } from 'antd';
import { formatNumber } from "utils/helpers/steemitHelpers";
import { selectBalance, selectTransactions, selectIsLoading } from 'features/Wallet/selectors';
import { getTransactionsBegin } from 'features/Wallet/actions/getTransactions';
import CircularProgress from 'components/CircularProgress';
import { selectMe } from 'features/User/selectors';
// import { toTimeAgo } from 'utils/date';

class Wallet extends Component {
  static propTypes = {
    me: PropTypes.string.isRequired,
    balance: PropTypes.string.isRequired,
    transactions: PropTypes.array.isRequired,
    isLoading: PropTypes.bool.isRequired,
    getTransactions: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.props.getTransactions();
  }

  render() {
    const { me, balance, isLoading, transactions } = this.props;

    if (isLoading || isEmpty(me)) {
      return <CircularProgress />;
    }

    return (
      <div className="wallet">
        <Helmet>
          <title>Wallet - Steemhunt</title>
        </Helmet>

        <div className="heading left-padded">
          <h3>Balance</h3>
        </div>
        <div className="balance left-padded">
          <h1 className="sans">{formatNumber(balance)}<small>HUNT</small></h1>

          <Tooltip title="External ETH wallet withdrawal feature is currently under development.">
            <Button
              type="primary"
              htmlType="submit"
              className="submit-button"
              ghost
            >
              WITHDRAW
            </Button>
          </Tooltip>
        </div>

        <div className="heading left-padded transaction-heading">
          <h3>Transactions</h3>
        </div>
        <List
          itemLayout="horizontal"
          dataSource={transactions}
          renderItem={t => (
            <List.Item className="left-padded">
              <List.Item.Meta
                avatar={me === t.sender ?
                  <Avatar icon="arrow-right" className="red-filled"/>
                :
                  <Avatar icon="arrow-left" className="green-filled" />
                }
                title={me === t.sender ?
                  `Sent ${formatNumber(t.amount)} to ` + (t.receiver ? `@${t.receiver}` : `ETH Wallet (${t.eth_address})`)
                :
                  `Received ${formatNumber(t.amount)} from ` + (t.sender ? `@${t.sender}` : `ETH Wallet (${t.eth_address})`)
                }
                description={t.memo}
              />
            </List.Item>
          )}
        />
      </div>
    );
  }
}

const mapStateToProps = (state, props) => createStructuredSelector({
  me: selectMe(),
  balance: selectBalance(),
  transactions: selectTransactions(),
  isLoading: selectIsLoading(),
});

const mapDispatchToProps = (dispatch, props) => ({
  getTransactions: user => dispatch(getTransactionsBegin()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Wallet);
