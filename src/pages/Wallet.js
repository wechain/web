import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { List, Icon, Avatar } from 'antd';
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

    if (isLoading) {
      return <CircularProgress />;
    }


    return (
      <div className="wallet">
        <Helmet>
          <title>Wallet - Steemhunt</title>
        </Helmet>

        <h1>Your balance</h1>
        {balance} HUNT

        <h1>Transactions</h1>
        <List
          itemLayout="horizontal"
          dataSource={transactions}
          renderItem={t => (
            <List.Item>
              <List.Item.Meta
                avatar={me === t.sender ?
                  <Avatar size="large" icon="arrow-right" className="red-filled"/>
                :
                  <Avatar size="large" icon="arrow-left" className="green-filled" />
                }
                title={me === t.sender ?
                  `Sent ${t.amount} to ` + (t.receiver ? `@${t.receiver}` : `ETH Wallet (${t.eth_address})`)
                :
                  `Received ${t.amount} from ` + (t.sender ? `@${t.sender}` : `ETH Wallet (${t.eth_address})`)
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
