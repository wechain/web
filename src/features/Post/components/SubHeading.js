import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { timeUntilMidnightSeoul } from 'utils/date';
import { formatAmount } from "utils/helpers/steemitHelpers";

export class SubHeading extends PureComponent {
  static propTypes = {
    huntsCount: PropTypes.number.isRequired,
    dailyTotalReward: PropTypes.number.isRequired,
    daysAgo: PropTypes.number.isRequired,
  };

  constructor() {
    super();
    this.state = {
      timer: null,
    };
  }

  componentDidMount() {
    this.interval = setInterval(this.tick, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  tick = () => {
    const timeLeft = timeUntilMidnightSeoul(true)

    if (timeLeft === '00:00:00') {
      this.setState({ timer: (<div>Today's ranking competition is finished. Please <a onClick={() => window.location.reload()}>refresh your page.</a></div>) });
      clearInterval(this.interval);
    } else {
      this.setState({ timer: (<div><b>{timeLeft}</b> left till midnight (KST)</div>) });
    }
  }

  render() {
    const { huntsCount, dailyTotalReward, daysAgo } = this.props;

    return (
      <div className="heading-sub">
        <b>{huntsCount}</b> products, <b>{formatAmount(dailyTotalReward)}</b> SBD hunter’s rewards were generated.<br/>
        {daysAgo === 0 && this.state.timer }
      </div>
    );
  }
}
