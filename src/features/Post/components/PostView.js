import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Button, Carousel, Icon, Timeline, Tag, Tooltip, Modal, Input, Form } from 'antd';
import IconFacebook from 'react-icons/lib/fa/facebook-square';
import IconTwitter from 'react-icons/lib/fa/twitter-square';
import IconLinkedIn from 'react-icons/lib/fa/linkedin-square';
import { Link } from 'react-router-dom';
import isEmpty from 'lodash/isEmpty';
import { getPostPath, isEditable, addReferral } from '../utils';
import VoteButton from 'features/Vote/VoteButton';
import ResteemButton from './ResteemButton';
import Author from 'components/Author';
import { selectMe } from 'features/User/selectors';
import { getHtml } from 'components/Body';
import { shortFormat } from 'utils/date';
import { isModerator, isAdmin } from 'features/User/utils';
import { setModeratorBegin, moderatePostBegin } from 'features/Post/actions/moderatePost';
import { replyBegin } from 'features/Comment/actions/reply';
import { selectIsCommentPublishing, selectHasCommentSucceeded } from 'features/Comment/selectors';

const FormItem = Form.Item;

class PostView extends Component {
  static propTypes = {
    post: PropTypes.shape({
      url: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      tagline: PropTypes.string.isRequired,
      tags: PropTypes.arrayOf(PropTypes.string).isRequired,
      images: PropTypes.arrayOf(PropTypes.object).isRequired,
      author: PropTypes.string,
      active_votes: PropTypes.arrayOf(PropTypes.object).isRequired,
      payout_value: PropTypes.number.isRequired,
      children: PropTypes.number.isRequired,
      is_active: PropTypes.bool.isRequired,
      is_verified: PropTypes.bool.isRequired,
      verified_by: PropTypes.string,
      beneficiaries: PropTypes.arrayOf(PropTypes.shape({
        account: PropTypes.string.isRequired,
        weight: PropTypes.number.isRequired,
      })),
    }).isRequired,
    author: PropTypes.string,
    permlink: PropTypes.string,
    me: PropTypes.string.isRequired,
    isCommentPublishing: PropTypes.bool.isRequired,
    hasCommentSucceeded: PropTypes.bool.isRequired,
    setModerator: PropTypes.func.isRequired,
    moderatePost: PropTypes.func.isRequired,
    moderatorReply: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      previewImage: '',
      previewVisible: false,
      moderationVisible: false,
      moderationComment: '',
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.post.verified_by !== this.props.me) {
      this.setState({ moderationVisible: false });
    }

    if (nextProps.hasCommentSucceeded &&
      this.props.hasCommentSucceeded !== nextProps.hasCommentSucceeded &&
      !isEmpty(this.state.moderationComment)) {
      this.setState({ moderationComment: '' });
      this.hideModeration();
    }
  }

  // MARK: - Handle modals

  hideModal = () => this.setState({ previewVisible: false });
  showModal = (e) => {
    this.setState({
      previewImage: e.target.src,
      previewVisible: true,
    });
  };
  hideModeration = () => this.setState({ moderationVisible: false });
  showModeration = () => {
    this.setState({ moderationVisible: true });
    this.props.setModerator();
  };

  changePreview = (diff) => {
    const images = this.props.post.images;

    for (let i in images) {
      if (images[i].link === this.state.previewImage) {
        let newIndex = parseInt(i, 10) + diff;
        if (newIndex < 0) {
          newIndex = images.length + newIndex;
        }
        if (newIndex >= images.length) {
          newIndex = newIndex - images.length;
        }

        return this.setState({ previewImage: images[newIndex].link });
      }
    }
  };

  toggleHidden = () => {
    this.props.moderatePost(!this.props.post.is_active, true);
  };
  toggleVerified = () => {
    this.props.moderatePost(this.props.post.is_active, !this.props.post.is_verified);
  };
  handleModerationCommentChange = (e) => this.setState({ moderationComment: e.target.value });
  commentModeration = () => {
      const comment = this.state.moderationComment.trim();
      if (comment) {
        this.props.moderatorReply(comment);
      }
  };

  render() {
    const { me, post } = this.props;
    const images = post.images.map((image, index) => {
      return (
        <div key={index} className="slide-container">
          <img alt={image.name} src={image.link} onClick={this.showModal} />
        </div>
      );
    });
    const tags = post.tags.map((tag, index) => {
      // TODO: To steemhunt tags
      return (
        <Tag key={index}><a href={`https://steemit.com/trending/${tag}`} target="_blank" rel="noopener noreferrer">{tag}</a></Tag>
      );
    });
    const beneficiaries = post.beneficiaries && post.beneficiaries.map((b, index) => {
      return (
        <Timeline.Item key={index}><Author name={b.account} /> ({b.weight / 100}%)</Timeline.Item>
      );
    })

    const shouldShowEdit = window.location.pathname !== '/post' && me === post.author && isEditable(post);

    return (
      <div className="post-view diagonal-split-view">
        <div className="top-container primary-gradient">
          <span className="featured-date round-border" data-id={post.id}>Featured on {shortFormat(post.created_at)}</span>

          <div className="edit-buttons">
            {shouldShowEdit &&
              <Link to={`${getPostPath(post)}/edit`}>
                <Button icon="edit" size="small" ghost>Edit</Button>
              </Link>
            }
            {isModerator(me) &&
              <span>
                {(post.verified_by === me || post.verified_by === null || isAdmin(me)) ?
                    (post.author === me ?
                      <Button icon="check-circle" size="small" ghost disabled>
                        Own Content
                      </Button>
                    :
                      <Button icon={post.verified_by === me && !post.is_verified ? 'loading' : 'check-circle'} size="small" onClick={this.showModeration} ghost>
                        { !post.is_active ? 'Unhide' : post.is_verified ? 'Unverify' : (post.verified_by === me ? "You're reviewing" : 'Verify') }
                      </Button>
                    )
                  :
                    (post.is_verified ?
                      <Button icon="check-circle" size="small" ghost disabled>
                        <span>Reviewed by @{post.verified_by}</span>
                      </Button>
                    :
                      <Button loading={true} size="small" ghost disabled>
                        <span>In review by @{post.verified_by}</span>
                      </Button>
                    )
                }
              </span>
            }
          </div>
          <h1>{post.title}</h1>
          <h2>{post.tagline}</h2>
          <Button
            href={addReferral(post.url)}
            type="primary"
            htmlType="submit"
            className="round-border inversed-color padded-button checkitout-button"
            target="_blank"
            rel="noopener noreferrer"
          >
            CHECK IT OUT
          </Button>
        </div>
        <div className="diagonal-line"></div>
        <div className="bottom-container">
          {post.images.length === 0 ?
            <Carousel className="carousel" effect="fade">
              <div><Icon type="camera-o" /></div>
            </Carousel>
          :
            <Carousel className="carousel" autoplay={true} effect="scrollx">
              {images}
            </Carousel>
          }

          <div className="description">
            {post.description && getHtml(post.description)}
          </div>

          <div className="timeline-container">
            <ul className="left">
              {post.author && <li>Hunter</li>}
              {beneficiaries && beneficiaries.length > 0 && <li>Makers</li>}
            </ul>

            <Timeline>
              {post.author && <Timeline.Item><Author name={post.author} /></Timeline.Item>}
              {beneficiaries}
            </Timeline>
          </div>

          <div className="vote-container">
            <VoteButton post={post} type="post" layout="detail-page" />

            { me && me !== post.author &&
              <ResteemButton post={post} />
            }

            <div className="social-shares">
              <Tooltip title="Share on Facebook">
                <a
                  href={'https://www.facebook.com/sharer.php?u=' + encodeURI(window.location.href)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="share-icon"
                >
                  <IconFacebook />
                </a>
              </Tooltip>
              <Tooltip title="Share on Twitter">
                <a href={'https://twitter.com/intent/tweet?url=' + encodeURI(window.location.href) +
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
                  href={'https://www.linkedin.com/shareArticle?mini=true' +
                    '&url=' + encodeURI(window.location.href) +
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
            </div>
          </div>

          <div className="tags">
            {tags}
          </div>
        </div>
        <Modal visible={this.state.previewVisible} footer={null} onCancel={this.hideModal} width="50%" className="preview-modal">
          <img alt="Preview" src={this.state.previewImage} />
          <div className="prev" onClick={() => this.changePreview(-1)}>
            <Icon type="left" />
          </div>
          <div className="next" onClick={() => this.changePreview(1)}>
            <Icon type="right" />
          </div>
        </Modal>
        {isModerator(me) &&
          <Modal visible={this.state.moderationVisible} footer={null} onCancel={this.hideModeration}>
            <Form>
              <FormItem label="Moderation Comment:">
                <Input.TextArea
                  placeholder="You must leave a comment to receive the moderator’s upvoting."
                  value={this.state.moderationComment}
                  onChange={this.handleModerationCommentChange}
                  autosize
                />
              </FormItem>
              <FormItem style={{marginBottom: 0}}>
                <Button
                  icon="delete"
                  type="danger"
                  loading={this.props.isModerating}
                  onClick={this.toggleHidden}
                >
                  { post.is_active ? 'Hide' : 'Unhide' }
                </Button>

                <Button
                  icon="check-circle"
                  type="primary"
                  className="pull-right"
                  loading={this.props.isModerating}
                  onClick={this.toggleVerified}
                >
                  { post.is_verified ? 'Unverify' : 'Verify' }
                </Button>
                <Button
                  icon="message"
                  className="pull-right"
                  loading={this.props.isCommentPublishing}
                  onClick={this.commentModeration}
                  style={{ marginRight: '0.5em' }}
                >
                  Comment
                </Button>
              </FormItem>
            </Form>
          </Modal>
        }
      </div>
    )
  }
}

const mapStateToProps = () => createStructuredSelector({
  me: selectMe(),
  isCommentPublishing: selectIsCommentPublishing(),
  hasCommentSucceeded: selectHasCommentSucceeded(),
});

const mapDispatchToProps = (dispatch, props) => ({
  setModerator: () => dispatch(setModeratorBegin(props.post)),
  moderatePost: (is_active, is_verified, comment) => dispatch(moderatePostBegin(props.post, is_active, is_verified, comment)),
  moderatorReply: (body) => dispatch(replyBegin(props.post, body, true)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PostView);
