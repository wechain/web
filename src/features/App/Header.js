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
import { selectSearchTerm } from 'features/Post/selectors';
import { getFollowingsBegin } from 'features/User/actions/getFollowings';
import { followBegin } from 'features/User/actions/follow';
import { logoutBegin } from 'features/User/actions/logout';
import { setSearchTerm } from 'features/Post/actions/searchPost';
import logo from 'assets/images/logo-nav-pink@2x.png'
import AvatarSteemit from 'components/AvatarSteemit';
import { formatNumber } from 'utils/helpers/steemitHelpers';

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

  changeVisibility = (visible) => this.setState({ menuVisible: visible });

  setSearchVisible = (bool) => {
    this.setState({ searchVisible: bool }, () => {
      if (bool) {
        this.searchInput.focus();
      }
    });
  };

  handleSearch = (e) => this.props.setSearchTerm(e.target.value);

  resetSearch() {
    this.props.setSearchTerm(null);
    this.setSearchVisible(false);
  }

  handleKeyPress = (e) => {
    if (e.keyCode === 27) { // ESC
      this.resetSearch();
    }
  };

  currentVotingPower = ({ last_vote_time, voting_power }) => {
    const vpLeft = voting_power / 100;
    const lastVotingTime = Date.parse(last_vote_time) - (new Date().getTimezoneOffset() * 60 * 1000);
    const secPassed = (Date.now() - lastVotingTime) / 1000;
    const currentVP = (vpLeft + (secPassed / 3600) * (20/24));
    const vp = currentVP > 100 ? 100 : currentVP;

    return Math.round(vp * 100) / 100;
  }

  render() {
    const { me, myAccount, myFollowingsList, myFollowingsLoadStatus, isLoading, follow, searchTerm } = this.props;
    const isFollowing = myFollowingsList.find(following => following.following === 'steemhunt');
    const isFollowLoading = isLoading || myFollowingsLoadStatus['steemhunt'];
    const searchBarHidden = (this.props.path === '/wallet' || this.props.path === '/post');

    let menu;
    if(me) {
      menu = (
        <Menu theme="dark">
          {!isFollowing && me !== 'steemhunt' &&
            <Menu.Item key="0">
               <span onClick={follow}>
                <Icon type={isFollowLoading ? 'loading' : 'star-o'} />
                FOLLOW STEEMHUNT
              </span>
            </Menu.Item>
          }

          <Menu.Item key="1">
            <a href="https://token.steemhunt.com" rel="noopener noreferrer" target="_blank">
              <Icon type="api" /> ABOUT HUNT PLATFORM
            </a>
          </Menu.Item>
          <Menu.Item key="2">
            <Link to="/hall-of-fame" onClick={() => this.changeVisibility(false)}>
              <Icon type="trophy" /> HALL OF FAME
            </Link>
          </Menu.Item>
          <Menu.Item key="3">
            <Link to={`/wallet`} onClick={() => this.changeVisibility(false)}>
              <Icon type="wallet" /> WALLET <sup>beta</sup>
            </Link>
          </Menu.Item>
          <Menu.Item key="4">
            <Link to={`/author/@${me}`} onClick={() => this.changeVisibility(false)}>
              <Icon type="user" /> MY PROFILE
            </Link>
          </Menu.Item>
          <Menu.Item key="4-1" className="sub">
            <Link to={`/author/@${me}`} onClick={() => this.changeVisibility(false)}>
              <Icon type="up-circle-o" />
              Level: {myAccount.level}&nbsp;
              ({formatNumber(myAccount.user_score, '0,0.00')}
                {myAccount.boost_score && myAccount.boost_score > 1 && <span> x {myAccount.boost_score}</span> }
              )
            </Link>
          </Menu.Item>
          <Menu.Item key="4-2" className="sub">
            <Link to={`/author/@${me}`} onClick={() => this.changeVisibility(false)}>
              <Icon type="loading-3-quarters" />
              Voting Power: {formatNumber(this.currentVotingPower(myAccount), '0,0.00')}%
            </Link>
          </Menu.Item>
          <Menu.Item key="5">
            <a href="https://discord.gg/mWXpgks" rel="noopener noreferrer" target="_blank">
              <Icon type="message" /> CHAT ON DISCORD
            </a>
          </Menu.Item>
          <Menu.Item key="6">
            <span onClick={this.props.logout}>
              <Icon type="poweroff" /> LOGOUT
            </span>
          </Menu.Item>
        </Menu>
      );
    } else {
      menu = (
        <Menu theme="dark">
          <Menu.Item key="0" className="two-column-hidden">
            <Link to="/about" onClick={() => this.changeVisibility(false)}>
              <Icon type="question-circle-o" /> ABOUT STEEMHUNT
            </Link>
          </Menu.Item>
          <Menu.Item key="1">
            <a href="https://token.steemhunt.com" rel="noopener noreferrer" target="_blank">
              <Icon type="api" /> ABOUT HUNT PLATFORM
            </a>
          </Menu.Item>
          <Menu.Item key="2">
            <Link to="/hall-of-fame" onClick={() => this.changeVisibility(false)}>
              <Icon type="trophy" /> HALL OF FAME
            </Link>
          </Menu.Item>
          <Menu.Item key="3">
            <a href="https://discord.gg/mWXpgks" rel="noopener noreferrer" target="_blank">
              <Icon type="message" /> CHAT ON DISCORD
            </a>
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
              onVisibleChange={this.changeVisibility}
              overlayClassName="menu-popover"
            >
              <span className="ant-dropdown-link header-button" role="button">
                <AvatarSteemit name={me} votingPower={this.currentVotingPower(myAccount)} />
              </span>
            </Popover>
          </div>
        }

        {!isLoading && !me &&
          <div className="pull-right">
            <a href={getLoginURL()} className="right-margin header-button smaller mobile-hidden">
              <Button shape="circle" icon="plus" />
            </a>
            <Popover
              content={menu}
              trigger="click"
              placement="bottom"
              visible={this.state.menuVisible}
              onVisibleChange={this.changeVisibility}
              overlayClassName="menu-popover"
            >
              <span className="right-margin header-button smaller">
                <Button shape="circle" icon="ellipsis" />
              </span>
            </Popover>

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
          {!searchBarHidden &&
            <Input.Search
              ref={node => this.searchInput = node}
              value={searchTerm}
              placeholder="Search products"
              onSearch={value => this.props.setSearchTerm(value)}
              onChange={this.handleSearch}
              onKeyDown={this.handleKeyPress}
              onBlur={() => this.setSearchVisible(false)}
              maxLength="40"
              className={`header-button smaller one-column-hidden right-margin${this.state.searchVisible ? ' active' : ''}`}
            />
          }
          <Button
            shape="circle"
            icon="search"
            className="header-button smaller right-margin two-column-hidden"
            onClick={() => this.setSearchVisible(true)}
          />

          <Link to="/about" className="header-button smaller right-margin two-column-hidden mobile-hidden">
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
  searchTerm: selectSearchTerm(),
});

const mapDispatchToProps = (dispatch, props) => ({
  follow: () => dispatch(followBegin('steemhunt')),
  logout: () => dispatch(logoutBegin()),
  getFollowings: me => dispatch(getFollowingsBegin(me)),
  setSearchTerm: (term) => dispatch(setSearchTerm(term)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
