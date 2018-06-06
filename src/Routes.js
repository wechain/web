import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';
import queryString from 'query-string';
import asyncComponent from 'asyncComponent';
import { Icon } from 'antd';
import isEmpty from 'lodash/isEmpty';
import { getMeBegin, refreshMeBegin } from 'features/User/actions/getMe';
import { selectMe } from 'features/User/selectors';
import { selectSearchTerm } from 'features/Post/selectors';
import Header from 'features/App/Header';
import Post from 'features/Post/Post';
import PostForm from 'features/Post/PostForm';
import Draft from 'features/Post/Draft';
import NotFound from 'components/NotFound';

const Home = asyncComponent(() => import('pages/Home'));
const Terms = asyncComponent(() => import('pages/Terms'));
const Privacy = asyncComponent(() => import('pages/Privacy'));
const Cookies = asyncComponent(() => import('pages/Cookies'));
const HuntedList = asyncComponent(() => import('pages/HuntedList'));
const Profile = asyncComponent(() => import('pages/Profile'));
const HuntedListByAuthor = asyncComponent(() => import('pages/HuntedListByAuthor'));
const HallOfFame = asyncComponent(() => import('pages/HallOfFame'));
const Search = asyncComponent(() => import('pages/Search'));
const Airdrop = asyncComponent(() => import('pages/Airdrop'));
const Wallet = asyncComponent(() => import('pages/Wallet'));

const BackButton = withRouter(({ history }) => (
  <Icon
    type="left"
    className="back-button"
    onClick={() => { history.go(-1) }}/>
));

export class RoutesLeft extends Component {
  shouldLeftBeActive() {
    const path = window.location.pathname;
    return (/^\/@.+/.test(path) && !/.+\/edit$/.test(path)) ||
      /^\/(about|terms|privacy|cookies)/.test(path) ||
      /^\/(hall-of-fame|author)\/@.+/.test(path);
  }

  render() {
    let className = 'panel-left';
    if (this.shouldLeftBeActive()) {
      className = 'panel-left active';
    }

    return (
      <div className={className} id="panel-left">
        <BackButton/>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/about" exact component={Home} />
          <Route path="/post" exact component={Draft} />
          <Route path='/terms' exact component={Terms} />
          <Route path='/privacy' exact component={Privacy} />
          <Route path='/cookies' exact component={Cookies} />
          <Route path="/hall-of-fame" exact component={Home} />
          <Route path="/hall-of-fame/@:author/:permlink" exact component={Post} />
          <Route path="/@:author/:permlink" exact component={Post} />
          <Route path="/@:author/:permlink/edit" exact component={Draft} />
          <Route path="/author/@:author" exact component={Profile} />
          <Route path="/author/@:author/:permlink" exact component={Post} />
          <Route path="/wallet" exact component={Airdrop} />
          <Route path='*' component={NotFound} />
        </Switch>
      </div>
    );
  }
}

class Right extends Component {
  static propTypes = {
    me: PropTypes.string.isRequired,
    searchTerm: PropTypes.string,
    getMe: PropTypes.func.isRequired,
    refreshMe: PropTypes.func.isRequired,
  };

  componentDidMount() {
    let accessToken = null;
    if (this.props.location.search) {
      accessToken = queryString.parse(this.props.location.search).access_token;
    }

    this.props.getMe(accessToken); // with existing token

    this.refresher = setInterval(this.props.refreshMe, 60000); // to update voting power gage
  }

  componentWillUnmount() {
    clearInterval(this.refresher);
  }

  render() {
    const List = isEmpty(this.props.searchTerm) ? HuntedList : Search;
    const AuthorList = isEmpty(this.props.searchTerm) ? HuntedListByAuthor : Search;
    const TopList = isEmpty(this.props.searchTerm) ? HallOfFame : Search;

    return (
      <div className="panel-right">
        {this.props.location.search && <Redirect to="/" /> /* Authentication redirection */ }
        <Header/>
        <Switch>
          <Route path="/" exact component={List} />
          <Route path="/about" exact component={List} />
          <Route path="/post" exact component={PostForm} />
          <Route path="/hall-of-fame" component={TopList} />
          <Route path="/@:author/:permlink/edit" exact component={PostForm} />
          <Route path="/@:author/:permlink" exact component={List} />
          <Route path="/author/@:author" component={AuthorList} />
          <Route path="/wallet" exact component={Wallet} />
          <Route path='*' component={List} />
        </Switch>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => createStructuredSelector({
  me: selectMe(),
  searchTerm: selectSearchTerm(),
});

const mapDispatchToProps = dispatch => ({
  getMe: token => dispatch(getMeBegin(token)),
  refreshMe: () => dispatch(refreshMeBegin()),
});

export const RoutesRight = withRouter(connect(mapStateToProps, mapDispatchToProps)(Right));
