import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Popconfirm } from 'antd';
import { resteemBegin } from '../actions/resteem';
import steem from 'steem';

class ResteemButton extends PureComponent {
  static propTypes = {
    post: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      alreadyResteemed: true
    }
  }

  componentDidMount() {
    this.getRebloogers()
      .then((reblogged) => {
        this.setState({ alreadyResteemed: reblogged })
      })
  }

  async getRebloogers() {
    const { author, permlink } = this.props.post;
    const rebloggers = await steem.api.getRebloggedByAsync(author, permlink);
    return rebloggers.includes(this.props.me)
  }

  clickResteem = async (post) => {
    await this.props.resteem(post)
    this.setState({ alreadyResteemed: true })
  }

  render() {
    const { post } = this.props;

    return (
      <Popconfirm title="Are you sure to resteem this post?" onConfirm={() => this.clickResteem(post)} okText="Yes" cancelText="No">
        <Button
          type="default"
          disabled={this.state.alreadyResteemed}
          size="small"
          icon="retweet"
          className="resteem-button"
          loading={post.isResteeming}
        >
          Resteem
          </Button>
      </Popconfirm>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  resteem: post => dispatch(resteemBegin(post)),
});

export default connect(null, mapDispatchToProps)(ResteemButton);
