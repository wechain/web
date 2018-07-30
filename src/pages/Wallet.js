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
import { shortFormat } from 'utils/date';
import tokenPlaceholder from 'assets/images/wallet/token-placeholder@2x.png';

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

        <div className="balance-bar left-padded right-padded">
          <div className="left">
            <div className="sans small">Token Balance</div>
            <div className="sans balance">{formatNumber(balance)} HUNT</div>
          </div>
          <div className="right">
            <Tooltip title="SP holder airdrop is not available yet. We'll announce it when it becomes available.">
              <Button
                type="primary"
                className="submit-button"
                ghost
              >
                SP CLAIM
              </Button>
            </Tooltip>
            <Tooltip title="ERC-20 wallet withdrawal feature is currently under development.">
              <Button
                type="primary"
                className="submit-button"
                ghost
              >
                WITHDRAW
              </Button>
            </Tooltip>
          </div>
        </div>

        {transactions.length === 0 ?
          <div className="placeholder">
            <img src={tokenPlaceholder} alt="No transactions" />
            <p>No Transactions Yet</p>
          </div>
        :
          <div>
            <div className="heading left-padded transaction-heading">
              <h3>Transactions</h3>
            </div>
            <List
              itemLayout="horizontal"
              dataSource={transactions}
              className="transactions"
              renderItem={t => (
                <List.Item className="left-padded transaction-item">
                  <List.Item.Meta
                    avatar={me === t.sender ?
                      <Avatar icon="arrow-right" className="icon sent"/>
                    :
                      <Avatar icon="arrow-left" className="icon received" />
                    }
                    title={me === t.sender ?
                      <div className="title sent">
                        {`Sent ${formatNumber(t.amount)} to ` + (t.receiver ? `@${t.receiver}` : `ETH Wallet (${t.eth_address})`)}
                      </div>
                    :
                      <div className="title received">
                        {`Received ${formatNumber(t.amount)} from ` + (t.sender ? `@${t.sender}` : `ETH Wallet (${t.eth_address})`)}
                      </div>
                    }
                    description={
                      <div>
                        <div className="memo">{t.memo}</div>
                        <div className="date">{shortFormat(t.created_at)}</div>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </div>
        }
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
