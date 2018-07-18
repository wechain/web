import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import isEmpty from 'lodash/isEmpty';
import { Helmet } from 'react-helmet';
import { Icon, Timeline } from 'antd';
import { setCurrentCategoryBegin } from 'features/Post/actions/setCurrentCategory';
import { selectCurrentCategory } from 'features/Post/selectors';
import { COLOR_PRIMARY, COLOR_LIGHT_GREY } from 'styles/constants';
import UserSteemPower from 'features/User/components/UserSteemPower';
import UserEstimatedValue from 'features/User/components/UserEstimatedValue';
import FollowerCount from 'features/User/components/FollowerCount';
import FollowButton from 'features/User/components/FollowButton';
import CircularProgress from 'components/CircularProgress';
import { scrollTop } from 'utils/scroller';
import { formatNumber } from 'utils/helpers/steemitHelpers';
import { getCachedImage } from 'features/Post/utils';

class Category extends Component {
  static propTypes = {
    currentCategory: PropTypes.string,
    setCurrentCategory: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const { match } = this.props;
    if (match.params.category !== this.props.currentCategory) {
      this.props.setCurrentCategory(match.params.category);
    }
    scrollTop();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.match.params.category !== nextProps.currentCategory) {
      this.props.setCurrentCategory(nextProps.match.params.category);
      scrollTop();
    }
  }

  render() {
    const { currentCategory } = this.props;
    if (isEmpty(currentCategory)) {
      return <CircularProgress />;
    }

    return (
      <div className="profile diagonal-split-view">
        <Helmet>
          <title>{currentCategory} - Steemhunt</title>
        </Helmet>
        <div className="top-container primary-gradient" style={{
            display: 'flex',
            height: '100vh',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
          <h1>{currentCategory}</h1>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => createStructuredSelector({
  currentCategory: selectCurrentCategory(),
});

const mapDispatchToProps = (dispatch, props) => ({
  setCurrentCategory: user => dispatch(setCurrentCategoryBegin(user)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Category);
