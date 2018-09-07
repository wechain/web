import React, { Component } from 'react';
import PropTypes from 'prop-types';
import IconFacebook from 'react-icons/lib/fa/facebook-square';
import IconTwitter from 'react-icons/lib/fa/twitter-square';
import IconLinkedIn from 'react-icons/lib/fa/linkedin-square';
import { Tooltip, Popover, Button, Icon, message } from 'antd';
import {CopyToClipboard} from 'react-copy-to-clipboard';

class ShareButton extends Component {
  static propTypes = {
    post: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
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
            className="share-icon"
          >
            <IconFacebook />
          </a>
        </Tooltip>
        <Tooltip title="Share on Twitter">
          <a href={'https://twitter.com/intent/tweet?url=' + shareUrl + 'type=2' +
            '&text=' + encodeURI(post.title) +
            '&hashtags=steemhunt,steem'}
            target="_blank"
            rel="noopener noreferrer"
            className="share-icon"
          >
            <IconTwitter />
          </a>
        </Tooltip>
        <Tooltip title="Share on LinkedIn">
          <a
            href={'https://www.linkedin.com/shareArticle?url=' + shareUrl + 'type=3' +
              '&mini=true' +
              '&title=' + encodeURI(post.title) +
              '&summary=' + encodeURI(post.tagline) +
              '&source=Steemhunt'}
            target="_blank"
            rel="noopener noreferrer"
            className="share-icon"
          >
            <IconLinkedIn />
          </a>
        </Tooltip>
        <Tooltip title="Copy to clipboard">
          <CopyToClipboard text={window.location.href + (me ? `?ref=${me}&` : '?') + 'type=0'} onCopy={() => message.success('Successfully copied to your clipboard.')}>
            <IconLinkedIn />
          </CopyToClipboard>
        </Tooltip>
      </div>
    )
    return (
      <Popover content={content} trigger="hover" >
        <Button className="share-button"> <Icon type="share-alt" theme="outlined" /> Share</Button>
      </Popover>
    )
  }
}


export default ShareButton;
