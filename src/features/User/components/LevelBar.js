import React, { Component } from 'react';
import { Row, Col, Icon, Modal } from 'antd';
import { LEVEL_TIER, levelFor } from 'features/User/utils';

const ColoredCol = ({ userScore }) => {
  const maxLevel = LEVEL_TIER[LEVEL_TIER.length - 1];

  return Array(maxLevel).fill().map((_, i) => i).map((i) => {
    let weight = 0;
    if (i <= userScore) {
      weight = 1;
    } else if (i - 1 < userScore < i) {
      weight = (userScore - (i - 1));
    }

    const width = (weight > 0) ? `${weight * 100 || 0}%` : 0

    return (
      <Col className="level-col" key={`colored-${i}`} span={3}>
        <div style={{
          backgroundColor: '#ff9c99',
          height: '100%',
          width: width,
        }}>
        </div>
      </Col>
    );
  });
}

const LevelLabels = () => {
  const levels = Array(LEVEL_TIER.length + 1).fill().map((_, i) => i);

  return [0].concat(LEVEL_TIER).map(Number).map((tier, i) => {
    const left = `calc(${(tier / 8) * 100}% - 15px)`;

    return (
      <span key={i} className="bar-label" style={{ left: left }}>{`LV. ${levels[i]}`}</span>
    )
  });
}

const ModalContent = () => {
  return (
    <div className="pop-content">
    <h4>Increased</h4>
    <ul>
      <li>When account credibility is increased (higher reputation, older accounts)</li>
      <li> When user login to Steemhunt more frequently</li>
      <li>When user vote on more hunt pots</li>
      <li> When user vote with more weight and earlier timing on hunt posts (same curation penalty applied for the first 30 minutes of posting)</li>
      <li>When user hunted and it's on ranked high</li>
      <li>When user is selected as our community influencer (it's a temporary role and anyone can apply on our Discord #influencer-apply channel)</li>
    </ul>
    <h4>Decreased</h4>
    <ul>
      <li>When user's reputation is decreased</li>
      <li>When user login to Steemhunt less frequently</li>
      <li>When user vote on the same group of people many times</li>
      <li>When user does circle voting with a specific group</li>
      <li>When user hunted and it's on ranked low</li>
    </ul>
  </div>
  )
}

class LevelBar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      modalVisible: false
    }
  }

  toggleModal = () => {
    console.log('clicked');
    this.setState({
      modalVisible: !this.state.modalVisible,
    });
  }

  render() {
    const { userScore } = this.props;

    return (
      <div className="level-bar">
        <Row className="level-row">
          <LevelLabels />
          <ColoredCol userScore={userScore} />
        </Row>
        <h2>Hunter Level : {levelFor(userScore)}
          <a onClick={this.toggleModal}>
            <Icon className="level-question" type="question-circle-o" />
          </a>
        </h2>
        <Modal
            title="How did my level calculated?"
            visible={this.state.modalVisible}
            onOk={this.toggleModal}
            onCancel={this.toggleModal}
            footer={null}
            bodyStyle={{
              overflow: 'scroll',
              maxHeight: '50vh',
              WebkitOverflowScrolling: "touch",
            }}
          >
            <ModalContent />
          </Modal>
      </div>
    )
  }
}

export default LevelBar;