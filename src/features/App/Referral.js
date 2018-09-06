import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import api from 'utils/api';
import { Icon } from 'antd';

class Referral extends Component {

  constructor(props) {
    super(props);
    this.state = {
      reported: false
    };
  }

  componentDidMount() {
    window.document.getElementById('panel-left').addEventListener('scroll', (e) => this.scrollDetector(e));
    window.document.getElementById('panel-right').addEventListener('scroll', (e) => this.scrollDetector(e));
  }

  componentWillUnmount() {
    window.document.getElementById('panel-left').removeEventListener('scroll', (e) => this.scrollDetector(e));
    window.document.getElementById('panel-right').removeEventListener('scroll', (e) => this.scrollDetector(e));
  }

  scrollDetector(e) {
    if ((e.srcElement.scrollTop > 300) && !this.state.reported) {
      this.postReferral()
    }
  }

  postReferral() {
    this.setState({ reported: true }, () => {
      api.post('/referral', {
        ref: this.props.params.get('ref'),
        type: this.props.params.get('type'),
        path: this.props.pathname
      }, false);
    })
  }

  render() {
    return (
      <div className="top-banner-bar">
        <Link to="/about">
          Welcome to Steemhunt <Icon type="right-circle-o" />
        </Link>
        <button onClick={() => this.props.setBannerState(false)}>
          <Icon type="close-circle-o" theme="outlined" />
        </button>
      </div>
    )
  }
}

export default Referral;