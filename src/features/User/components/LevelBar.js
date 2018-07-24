import React from 'react';
import {
  Row, Col
} from 'antd';

const LEVELS = [0,1,2,3,5,8]
const USER_SCORES = [1,2,3,4,5,6,7,8]

const ColoredCol = ({userScore}) => {
  return USER_SCORES.map((i) => {
    let weight = 0;
    let borderRadius = '0px';

    if (i === USER_SCORES[0]) {
      borderRadius = '100px 0px 0px 100px';
    } else if (i === USER_SCORES[USER_SCORES.length]) {
      borderRadius = '0px 100px 100px 0px';
    }

    if (i <= userScore) {
      weight = 1;
    } else if (i-1 < userScore < i) {
      weight = (userScore - (i - 1));
      borderRadius = '0px 100px 100px 0px'
    }

    const width = (weight > 0) ? `${weight*100 || 0}%` : 0

    return (
      <Col span={3} style={colStyle}>
        <div style={{ 
          backgroundColor: '#52c41a', 
          height: '100%', width: width,
          borderRadius: borderRadius
        }}>
        {i === 1 ? <span style={zeroLabel}>0</span> : null}
          <span style={scoreLabel}>{i}</span>
        </div>
      </Col>
    ) 
  })
}

const LevelLabels = () => {
  return LEVELS.map((level, _index) => {
    const left = `calc(${(level/8)*100}% - 15px)`;
    
    return <span style={{
      position: 'absolute',
      left: left,
      bottom: '10px',
      fontSize: '5px',
      width: '30px',
    }}>{`LV. ${_index}`}</span>
  })
}

const LevelBar = ({userScore}) => {
  return (
    <Row style={rowStyle}>
      <LevelLabels/>
      <ColoredCol userScore={parseFloat(userScore)} />
    </Row>
  )
}

export default LevelBar;

const rowStyle = {
  backgroundColor: '#f5f5f5',
  borderRadius: '100px',
  width: '50%',
}

const colStyle = {
  borderRight: '1px solid white',
  height: 10,
}

const scoreLabel = {
  fontSize: '5px',
  color: '#ccc',
  position: 'absolute',
  right: '-3px',
  top: '10px',
}

const zeroLabel = {
  fontSize: '5px',
  color: '#ccc',
  position: 'absolute',
  left: '-3px',
  top: '10px',
}