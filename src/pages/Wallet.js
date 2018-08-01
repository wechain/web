import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import isEmpty from 'lodash/isEmpty';
import { List, Avatar, Button, Tooltip, Modal, Icon } from 'antd';
import { formatNumber } from "utils/helpers/steemitHelpers";
import { selectBalance, selectSPToClaim, selectTransactions, selectIsLoading, selectIsClaiming } from 'features/Wallet/selectors';
import { getTransactionsBegin } from 'features/Wallet/actions/getTransactions';
import { claimTokensBegin } from 'features/Wallet/actions/claimTokens';
import CircularProgress from 'components/CircularProgress';
import { selectMe } from 'features/User/selectors';
import { shortFormat } from 'utils/date';
import tokenPlaceholder from 'assets/images/wallet/token-placeholder@2x.png';

class Wallet extends Component {
  static propTypes = {
    me: PropTypes.string.isRequired,
    balance: PropTypes.string.isRequired,
    spToClaim: PropTypes.number.isRequired,
    transactions: PropTypes.array.isRequired,
    isLoading: PropTypes.bool.isRequired,
    getTransactions: PropTypes.func.isRequired,
    claimTokens: PropTypes.func.isRequired,
  };

  state = { modalVisible: false };

  componentDidMount() {
    this.props.getTransactions();
  }

  showModal = () => this.setState({ modalVisible: true });
  handleCancel = (e) => this.setState({ modalVisible: false });
  handleClaim = (e) => this.props.claimTokens();

  render() {
    const { me, balance, isLoading, transactions, spToClaim, isClaiming } = this.props;

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
            <Button
              type="primary"
              onClick={this.showModal}
              className="submit-button"
              ghost
            >
              SP CLAIM
            </Button>

            {spToClaim > 0 ?
              <Modal
                title="Airdrop for SP Holders"
                visible={this.state.modalVisible}
                onCancel={this.handleCancel}
                footer={[
                  <Button key="back" onClick={this.handleCancel}>Cancel</Button>,
                  <Button key="submit" type="primary" loading={isClaiming} onClick={this.handleClaim}>
                    Claim HUNT Tokens
                  </Button>,
                ]}
              >
                <div>
                  You have <span className="pink">{formatNumber(spToClaim)} HUNT</span> tokens to claim
                  <div className="text-small">1:1 ratio with your Steem Power (based on STEEM per VEST: 0.000495)</div>
                </div>
                <div className="top-margin">Do you want to claim your HUNT tokens?</div>
              </Modal>
            :
              <Modal
                title="Airdrop for SP Holders"
                visible={this.state.modalVisible}
                onCancel={this.handleCancel}
                footer={[
                  <Button key="ok" onClick={this.handleCancel} type="primary">OK</Button>
                ]}
              >
                <div>
                  <Icon type="check-circle" className="pink"/>&nbsp;
                  You have successfully claimed your token
                </div>
              </Modal>
            }
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
  spToClaim: selectSPToClaim(),
  isClaiming: selectIsClaiming(),
});

const mapDispatchToProps = (dispatch, props) => ({
  getTransactions: () => dispatch(getTransactionsBegin()),
  claimTokens: () => dispatch(claimTokensBegin()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Wallet);
