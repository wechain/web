import React, { Component } from 'react';
import { Icon, Row, Col } from 'antd';
import imgHuntToken from 'assets/images/wallet/img-pie-chart@2x.png';
import imgSpSwap from 'assets/images/wallet/img-sp-swap@2x.png';
import imgHuntPlatform from 'assets/images/wallet/img-hunt-platform@2x.png';
import iconOne from 'assets/images/wallet/num-1@2x.png';
import iconTwo from 'assets/images/wallet/num-2@2x.png';
import iconSponsor from 'assets/images/wallet/icon-sponsor@2x.png';
import iconUpvote from 'assets/images/wallet/icon-upvote@2x.png';
import iconReferral from 'assets/images/wallet/icon-referrals@2x.png';
import iconPosting from 'assets/images/wallet/icon-posting@2x.png';

export default class Airdrop extends Component {
  render() {
    return (
      <div className="airdrops primary-gradient">
        <h1>HUNT Token<br/>Airdrop</h1>

        <div className="thin">
          A total of 500M HUNT tokens will be issued, and 250M tokens (50%) will be airdropped to Steemians -
          largest-ever airdrop for Steemit users. SMT-based HUNT tokens are to be distributed in a 1:1 ratio
          to the ERC20 tokens held by Steemhunt off-chain wallet owners and registered Ether addresses

          <a href="https://github.com/Steemhunt/web/wiki/HUNT-Token-Airdrop-Manual" className="action" target="_blank" rel="noopener noreferrer">
            Check out Airdrop Manual <Icon type="right-circle-o" />
          </a>
        </div>

        <img src={imgHuntToken} alt="HUNT Token Airdrop" className="image token" />

        <small>* Total 500M issues - 250M for airdrop, 100M for private sales, and 150M for company holding.</small>

        <img src={iconOne} alt="No 1" className="icon-num" />
        <h2>100M tokens<br/>for SP holders</h2>
        <div className="thin">
          Steemit users who have Steem Power are eligible to have HUNT tokens with 1:1 ratio.
          This is based on a “first-come-first-get” system until all 100M tokens are claimed.
        </div>

        <img src={imgSpSwap} alt="Airdrop on SP Holders" className="image sp-swap" />

        <img src={iconTwo} alt="No 2" className="icon-num" />
        <h2>150M tokens for bounty rewards<br/>for Steemhunt contributors</h2>
        <div className="thin">
          The bounty program will run for a maximum of 500 days.
          We strongly believe that SMT will be ready within 500 days.
          Every day 300,000 tokens (150M / 500 days) will be distributed in four sub-categories.
        </div>

        <Row gutter={16}>
          <Col className="grid" span={12}>
            <img src={iconSponsor} alt="Sponsors" className="icon sponsors" />
            <h3>Sponsors</h3>
            <p>90,000 tokens per day are distributed for the sponsors who delegate SP in @steemhunt.</p>
          </Col>
          <Col className="grid" span={12}>
            <img src={iconUpvote} alt="Upvote" className="icon upvote" />
            <h3>Voting / Resteem</h3>
            <p>60,000 tokens per day will be distributed for people who upvote or resteem the hunter posts located under the “Today” section on Steemhunt.com.</p>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col className="grid" span={12}>
            <img src={iconReferral} alt="Referrals" className="icon referrals" />
            <h3>Referrals</h3>
            <p>90,000 tokens per day are distributed for people who refer Steemhunt to others. Both referrers and referees will gain the tokens.</p>
          </Col>
          <Col className="grid" span={12}>
            <img src={iconPosting} alt="Posting" className="icon posting" />
            <h3>Posting / Commenting</h3>
            <p>60,000 tokens per day are assigned for the hunters who received @steemhunt’s upvoting.</p>
          </Col>
        </Row>

        <h2 className="margin-top">HUNT Platform</h2>
        <div className="thin">
          We are going to create a HUNT Token Economy,
          a decentralised token system to reward product influencers,
          help them buy innovative products, and help makers reach out to product influencers.

          <a href="https://steemit.com/steemit/@steemhunt/announcing-hunt-token-airdrops-for-steemians-smart-media-token-project" className="action less-margin" target="_blank" rel="noopener noreferrer">
            Learn more <Icon type="right-circle-o" />
          </a>
        </div>

        <img src={imgHuntPlatform} alt="HUNT Platform" className="image hunt-platform" />
      </div>
    );
  }
}
