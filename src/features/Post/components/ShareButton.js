import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tooltip, Popover, Button, Icon, message, Modal } from 'antd';
import { CopyToClipboard } from 'react-copy-to-clipboard';

class ShareButton extends Component {
  static propTypes = {
    post: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false
    }
  }

  toggleModal = () => {
    this.setState({
      modalVisible: !this.state.modalVisible,
    });
  }

  render() {
    const { post, me } = this.props;
    const shareUrl = window.location.href + (me ? `%3Fref=${me}` : '');

    const content = (
      <div className="social-shares">
        <a
          className="share-button"
          href={'https://www.facebook.com/sharer.php?u=' + shareUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className="icon-facebook share-icon"></i>
        </a>
        <div class="vertical-line"></div>
        <a
          className="share-button"
          href={'https://twitter.com/intent/tweet?url=' + shareUrl +
          '&text=' + encodeURI(post.title) +
          '&hashtags=steemhunt,steem'}
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className="icon-twitter share-icon"></i>
        </a>
        <div class="vertical-line"></div>
        <a
          className="share-button"
          href={'https://pinterest.com/pin/create/button/?url=' + shareUrl +
          '&media=' + post.images[0].link +
          '&description=' + encodeURI(post.title + ' : ' + post.tagline)}
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className="icon-pinterest-p share-icon"></i>
        </a>
        <div class="vertical-line"></div>
        <CopyToClipboard text={window.location.href + (me ? `?ref=${me}` : '')} onCopy={() => message.success('Successfully copied to your clipboard.')}>
          <div class="share-button">
            <i className="icon-link share-icon"></i>
          </div>
        </CopyToClipboard>
      </div>
    )

    const ModalContent = () => {
      return (
        <div className="pop-content">
          <p>
            90,000 tokens per day are distributed to people who share hunting posts to their social media channels including Facebook, Twitter, Pinterest, and Linkedin.
          </p>
          <p>
            HUNT tokens will be assigned based on the share of the total daily traffic generated from all the shared posts via the social channels. For example, if today’s shared social media posts have reached 10,000 people and your shared post has generated 100 visitors, your share will be 1%. In this case, you will get 900 HUNT tokens (90,000*1%).
          </p>
          <p>
            A maximum of 100 tokens per traffic (click) can be issued.
          </p>
        </div>
      )
    }

    return (
      <div className="share-container">
        <Popover content={content} trigger="hover" overlayClassName	="social-popup"  >
          <Button className="share-button">
            <Icon type="share-alt" theme="outlined" /> SHARE
          </Button>
        </Popover>
        <p className="share-comment">Get social share airdrop !
          <a onClick={this.toggleModal}>
            &nbsp;<Icon type="question-circle-o" />
          </a>
        </p>
        <Modal
          title="Share the hunt and get free HUNT tokens!"
          visible={this.state.modalVisible}
          onOk={this.toggleModal}
          onCancel={this.toggleModal}
          footer={null}
          bodyStyle={{
            overflow: 'scroll',
            maxHeight: '50vh',
            WebkitOverflowScrolling: "touch",
          }}
        >
          <ModalContent />
        </Modal>
      </div>
    )
  }
}


export default ShareButton;
