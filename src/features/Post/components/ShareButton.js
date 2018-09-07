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
    const shareUrl = window.location.href + (me ? `%3Fref=${me}%26` : '%3F');

    const content = (
      <div className="social-shares">
        <Tooltip title="Share on Facebook">
          <a
            href={'https://www.facebook.com/sharer.php?u=' + shareUrl + 'type=1'}
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="icon-facebook-square share-icon"></i>
          </a>
        </Tooltip>
        <Tooltip title="Share on Twitter">
          <a href={'https://twitter.com/intent/tweet?url=' + shareUrl + 'type=2' +
            '&text=' + encodeURI(post.title) +
            '&hashtags=steemhunt,steem'}
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="icon-twitter-square share-icon"></i>
          </a>
        </Tooltip>
        <Tooltip title="Share on Pinterest">
          <a href={'https://pinterest.com/pin/create/button/?url=' + shareUrl + 'type=3' +
            '&media=' + post.images[0].link +
            '&description=' + encodeURI(post.title + ' : ' + post.tagline)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="icon-pinterest-square share-icon"></i>
          </a>
        </Tooltip>
        <CopyToClipboard text={window.location.href + (me ? `?ref=${me}&` : '?') + 'type=0'} onCopy={() => message.success('Successfully copied to your clipboard.')}>
            <i className="icon-link share-icon"></i>
          </CopyToClipboard>
      </div>
    )

    const ModalContent = () => {
      return (
        <div className="pop-content">
          <p>
            90,000 tokens per day are distributed for people who share hunting posts to their social media channels including Facebook, Twitter, Pinterest, and Linkedin.
          </p>
          <p>
            HUNT tokens will be assigned based on the share of the daily total traffics generated from all the shared posts via the social channels. For example, if today’s total visitors from the social shared posts are 10,000, and your shared posts has generated 100 visitors, your share will be 1%. In this case, you will get 900 HUNT tokens (90,000*1%).
          </p>
          <p>Maximum tokens per person per day is 1,000 tokens.</p>
        </div>
      )
    }

    return (
      <div className="share-container">
        <Popover content={content} trigger="hover" >
          <Button className="share-button"> <Icon type="share-alt" theme="outlined" /> Share</Button>
        </Popover>
        <p>Get social share airdrop !
          <a onClick={this.toggleModal}>
            &nbsp;<Icon className="level-question" type="question-circle-o" />
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
