import React, { Component } from 'react'
import { getLoginURL } from 'utils/token';
import api from 'utils/api';
import {
  Modal
} from 'antd';

class AppModal extends Component {

  constructor(props) {
    super(props)
    const params = new URLSearchParams(this.props.location.search);

    this.state = {
      modalVisible: params.get('ref') !== null,
      ref: params.get('ref'),
      type: params.get('type')
    }
  }

  postReferral() {
    this.setState({ modalVisible: false }, () => {
      api.post('/referral', {
        ref: this.state.ref,
        type: this.state.type,
        path: this.props.location.pathname
      }, false);
    })
  }

  render() {
    if (!this.state.ref) {
      return null
    }
    return (
      <div className="modal-container">
        <Modal
          title="Welcome to Steemhunt !"
          centered
          visible={this.state.modalVisible}
          onCancel={() => this.postReferral()}
          footer={
            <a href={getLoginURL()}>Login</a>
          }
        >
          <h2>Discover
Cool Products and
Get Rewards by
STEEM</h2>
          <p>
          You can surface new products, upvote and comment on them, and most importantly, you will be rewarded with STEEM tokens for your contribution.
          </p>
        </Modal>
      </div>
    )
  }
}

export default AppModal;