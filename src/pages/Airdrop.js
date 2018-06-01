import React, { Component } from 'react';
import { List, Avatar, Button, Tooltip } from 'antd';

export default class Airdrop extends Component {
  render() {
    return (
      <div className="airdrops primary-gradient">
        <h1>HUNT Token<br/>Airdrop</h1>

        <div>blah blah</div>

        <h2>1. Aridrop (100M)</h2>
        <Tooltip title="Airdrop on Steem Power holders is currently under development. Please check this page again by the end of July 2018.">
          <Button
            type="primary"
            htmlType="submit"
            className="submit-button"
            ghost
          >
            Claim your HUNT Token
          </Button>
        </Tooltip>

        <h2>2. Daily Bounty Pool (150M)</h2>
        <ul>
          <li>90K (30%) - Delegation Sponsors (running)</li>
          <li>60K (20%) - Voting, Resteem contribution (running)</li>
          <li>90K (30%) - Referrals (TBA)</li>
          <li>60K (20%) - Posting, Review comments, Moderators (TBA)</li>
        </ul>
      </div>
    );
  }
}
