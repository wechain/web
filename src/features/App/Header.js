import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { getLoginURL } from 'utils/token';
import { Menu, Popover, Icon, Button, Spin, Input } from 'antd';
import {
  selectMe,
  selectMyAccount,
  selectIsLoading,
  selectMyFollowingsLoadStatus,
  selectMyFollowingsList,
  selectMyFollowingsListLoaded
} from 'features/User/selectors';
import { getFollowingsBegin } from 'features/User/actions/getFollowings';
import { followBegin } from 'features/User/actions/follow';
import { logoutBegin } from 'features/User/actions/logout';
import { setSearchTerm } from 'features/Post/actions/searchPost';
import logo from 'assets/images/logo-nav-pink@2x.png'
import AvatarSteemit from 'components/AvatarSteemit';

class Header extends Component {
  static propTypes = {
    me: PropTypes.string.isRequired,
    isLoading: PropTypes.bool,
    myAccount: PropTypes.object.isRequired,
    myFollowingsLoadStatus: PropTypes.object.isRequired,
    myFollowingsList: PropTypes.array.isRequired,
    myFollowingsListLoaded: PropTypes.bool.isRequired,
    follow: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
    getFollowings: PropTypes.func.isRequired,
    setSearchTerm: PropTypes.func.isRequired,
  };

  state = {
    menuVisible: false,
    searchVisible: false,
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.me !== nextProps.me) {
      this.props.getFollowings(nextProps.me);
    }
  }

  handleVisibleChange = (visible) => this.setState({ menuVisible: visible });

  setSearchVisible = (bool) => {
    this.setState({ searchVisible: bool }, () => {
      if (bool) {
        this.searchInput.focus();
      }
    });
  };

  handleSearch = (e) => this.props.setSearchTerm(e.target.value);

  handleKeyPress = (e) => {
    if (e.keyCode === 27) { // ESC
      this.props.setSearchTerm('');
      this.setSearchVisible(false);
    }
  };

  render() {
    const { me, myAccount, myFollowingsList, myFollowingsLoadStatus, isLoading, follow } = this.props;
    const isFollowing = myFollowingsList.find(following => following.following === 'steemhunt');
    const isFollowLoading = isLoading || myFollowingsLoadStatus['steemhunt'];

    let menu;
    if(me) {
      menu = (
        <Menu theme="dark">
          {!isFollowing && me !== 'steemhunt' &&
            <Menu.Item key="0">
               <span onClick={follow}>
                <Icon type={isFollowLoading ? 'loading' : 'star-o'} />
                FOLLOW @STEEMHUNT
              </span>
            </Menu.Item>
          }
          <Menu.Item key="1">
            <Link to={`/@${me}`} onClick={() => this.handleVisibleChange(false)}>
              <Icon type="loading-3-quarters" /> VOTING POWER: {parseInt(myAccount.voting_power / 100, 10)}%
            </Link>
          </Menu.Item>
          <Menu.Item key="2">
            <Link to={`/@${me}`} onClick={() => this.handleVisibleChange(false)}>
              <Icon type="user" /> MY PROFILE
            </Link>
          </Menu.Item>
          <Menu.Item key="3">
            <span onClick={this.props.logout}>
              <Icon type="poweroff" /> LOGOUT
            </span>
          </Menu.Item>
        </Menu>
      );
    }

    return (
      <header>
        <Link to="/">
          <img src={logo} alt="logo" className="nav-logo"/>
        </Link>

        {isLoading &&
          <div className="pull-right">
            <Spin size="large" className="header-button smaller avatar-steemit" />
          </div>
        }

        {!isLoading && me &&
          <div className="pull-right">
            <Link to="/post" className="right-margin header-button smaller">
              <Button shape="circle" icon="plus" />
            </Link>
            <Popover
              content={menu}
              trigger="click"
              placement="bottomRight"
              visible={this.state.menuVisible}
              onVisibleChange={this.handleVisibleChange}
            >
              <span className="ant-dropdown-link header-button" role="button">
                <AvatarSteemit name={me} votingPower={myAccount.voting_power} />
              </span>
            </Popover>
          </div>
        }

        {!isLoading && !me &&
          <div className="pull-right">
            <a href={getLoginURL()} className="right-margin header-button smaller">
              <Button shape="circle" icon="plus" />
            </a>
            <Button type="primary" href={getLoginURL()} ghost className="right-margin header-button smaller">Login</Button>
            <Button
              type="primary"
              href="https://signup.steemit.com/?ref=steemhunt"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => window.gtag('event', 'signup_clicked', { 'event_category' : 'signup', 'event_label' : 'Header Button' })}
              className="header-button smaller"
            >
              Sign Up
            </Button>
          </div>
        }

        <div className="pull-right">
          <Input.Search
            ref={node => this.searchInput = node}
            placeholder="Search products"
            onSearch={value => this.props.setSearchTerm(value)}
            onChange={this.handleSearch}
            onKeyDown={this.handleKeyPress}
            onBlur={() => this.setSearchVisible(false)}
            className={`header-button smaller one-column-hidden right-margin${this.state.searchVisible ? ' active' : ''}`}
          />
          <Button
            shape="circle"
            icon="search"
            className="header-button smaller right-margin two-column-hidden"
            onClick={() => this.setSearchVisible(true)}
          />

          <Link to="/about" className="header-button smaller right-margin two-column-hidden">
            <Button shape="circle" icon="question" style={{ fontSize: '21px' }} />
          </Link>
        </div>
      </header>
    )
  }
}

const mapStateToProps = createStructuredSelector({
  me: selectMe(),
  isLoading: selectIsLoading(),
  myAccount: selectMyAccount(),
  myFollowingsLoadStatus: selectMyFollowingsLoadStatus(),
  myFollowingsList: selectMyFollowingsList(),
  myFollowingsListLoaded: selectMyFollowingsListLoaded(),
});

const mapDispatchToProps = (dispatch, props) => ({
  follow: () => dispatch(followBegin('steemhunt')),
  logout: () => dispatch(logoutBegin()),
  getFollowings: me => dispatch(getFollowingsBegin(me)),
  setSearchTerm: (term) => dispatch(setSearchTerm(term)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
