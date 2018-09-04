import React, { Component } from 'react'
import api from 'utils/api';

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
    if ((e.srcElement.scrollTop > 1000) && !this.state.reported) {
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
      null
    )
  }
}

export default Referral;