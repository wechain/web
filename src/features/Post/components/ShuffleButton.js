import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import api from 'utils/api';

class ShuffleButton extends PureComponent {
  static propTypes = {
    handleSortOption: PropTypes.func.isRequired,
    me: PropTypes.string.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      amount: false,
      claimed: false
    }
  }

  componentDidMount() {
    this.array = [ 10, 170, 150, 20, 200, 50, 100 ];
    this.index = 0;
  }

  tick = () => {
    this.setState({ amount: this.array[this.index++] });
    if (this.index >= this.array.length) {
      this.index = 0;
    }
  }

  shuffle = (el) => {
    this.interval = setInterval(this.tick, 100);

    const $button = document.getElementById('shuffle-button');
    $button.style.top = '-8px';
    setTimeout(function(){
      $button.style.top = '0';
    }, 150);

    if (this.state.claimed || !this.props.me) {
      return this.props.handleSortOption('random');
    }

    const $sound = document.getElementById("coin-sound");
    $sound.play();

    const $coin = document.getElementById('coin');
    $coin.classList.add('play');

    const $coinContainer = document.getElementById('coin-container');
    $coinContainer.classList.add('play');

    setTimeout(() => {
      api.post('/hunt_transactions/daily_shuffle.json', null, true, (res) => {
        clearInterval(this.interval);
        this.setState({ amount: res.amount, claimed: true });
        $coin.classList.remove('play');

        setTimeout(function() {
          $coinContainer.classList.remove('play');
        }, 3000);
      });

      this.props.handleSortOption('random');
    }, 3000);
  };

  render() {
    const { amount } = this.state;

    return (
      <div className="shuffle-container">
        <div className="coin-container" id="coin-container">
          <audio id="coin-sound" className="hidden">
            <source src="http://adobewordpress.com/tasarim/include/gold-sound.mp3" type="audio/mpeg" />
          </audio>
          <div className="coin" id="coin">
            <div className="front"></div>
            <div className="back"></div>
            <div className="side">
              <div className="circle"></div>
              <div className="circle"></div>
              <div className="circle"></div>
              <div className="circle"></div>
              <div className="circle"></div>
              <div className="circle"></div>
              <div className="circle"></div>
              <div className="circle"></div>
              <div className="circle"></div>
              <div className="circle"></div>
              <div className="circle"></div>
              <div className="circle"></div>
              <div className="circle"></div>
              <div className="circle"></div>
              <div className="circle"></div>
              <div className="circle"></div>
            </div>
          </div>
          {amount === 0 ?
            <div className="text">Already Claimed</div>
          : (amount === 1000 ?
            <div className="text">Jackpot! + {amount} HUNT</div>
          :
            <div className="text">+ {amount} HUNT</div>
          )}
        </div>
        <span
          id="shuffle-button"
          className="shuffle-button"
          onClick={this.shuffle}
        >
          <Icon type="retweet" />
        </span>
      </div>
    )
  }
}

export default ShuffleButton;