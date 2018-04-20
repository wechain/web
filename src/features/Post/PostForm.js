import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { Form, Row, Col, Input, InputNumber, Tooltip, Icon, Button, Upload, Modal } from 'antd';
import { selectDraft, selectIsPublishing } from './selectors';
import { selectMe } from 'features/User/selectors';
import { publishContentBegin } from './actions/publishContent';
import { updateDraft, resetDraft } from './actions/updateDraft';
import { initialState } from './actions';
import { splitTags } from 'utils/sanitizer';
import { timeUntilMidnightSeoul } from 'utils/date';
import api from 'utils/api';
import { selectCurrentPost } from './selectors';
import { getPostBegin, setCurrentPostKey } from './actions/getPost';
import { sanitizeText, addReferral } from './utils';

const FormItem = Form.Item;
let currentBeneficiaryId = 0;

class PostForm extends Component {
  // TODO: Save draft into localstorage

  static propTypes = {
    me: PropTypes.string.isRequired,
    draft: PropTypes.object.isRequired,
    updateDraft: PropTypes.func.isRequired,
    resetDraft: PropTypes.func.isRequired,
    publishContent: PropTypes.func.isRequired,
    isPublishing: PropTypes.bool.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      editMode: false,
      resetted: false,
      previewImageVisible: false,
      previewImage: '',
      fileList: [],
      beneficiariesValid: true,
      shouldRecalculateBeneficiary: false,
      guidelineVisible: false,
    };
    this.beneficiaryInput = {};
  }

  componentDidMount() {
    const { match: { params : { author, permlink }} } = this.props;
    if (author && permlink) {
      this.props.getPost(author, permlink);
      this.setState({ editMode: true, resetted: false });
    } else {
      this.checkAndResetDraft();
    }

    if (this.props.me) {
      this.props.updateDraft('author', this.props.me);
    }
  }

  componentWillUnmount() {
    this.checkAndResetDraft();
  }

  componentWillReceiveProps(nextProps) {
    const { match: { params : { author, permlink }} } = this.props;
    const nextAuthor = nextProps.match.params.author;
    const nextPermlink = nextProps.match.params.permlink;

    if (nextAuthor && nextPermlink) {
      if (author !== nextAuthor || permlink !== nextPermlink) {
        this.props.getPost(nextAuthor, nextPermlink);
      }
      this.setState({ editMode: true, resetted: false });

      if (this.props.draft.permlink !== nextProps.draft.permlink) {
        this.prepareForEdit(nextProps.draft);
      }
    } else {
      this.checkAndResetDraft();
    }

    if (this.props.me !== nextProps.draft.author) {
      this.props.updateDraft('author', this.props.me);
    }
  }

  componentDidUpdate() {
    if (this.state.shouldRecalculateBeneficiary) {
      this.onBeneficiariesChanged();
    }
  }

  setGuidelineVisible(guidelineVisible) {
    this.setState({ guidelineVisible });
  }

  checkAndResetDraft = () => {
    if (!this.state.resetted) {
      this.props.setCurrentPostKey(null);
      this.props.resetDraft();
      this.setState({ resetted: true });
    }
  };

  prepareForEdit = (draft) => {
    this.props.updateDraft('permlink', draft.permlink);
    this.setState({
      fileList: draft.images.map((f, i) => f &&
        {
          uid: i,
          name: f.name,
          url:  f.link,
          status: 'done',
          id: f.id,
          type: f.type,
          link: f.link,
          deletehash: f.deletehash,
          width: f.width,
          height: f.height,
        }
      ),
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();

    this.props.form.validateFieldsAndScroll();
    this.props.publishContent(this.state.editMode);
  };

  // MARK: - Beneficiaries
  // TODO: Refactor into a component

  onBeneficiariesChanged = () => {
    // TODO: FIXME: HACK:
    // value is one step behind because maybe the inputNumberRef doesn't set synchronously
    setTimeout(() => {
      const { form } = this.props;
      const beneficiaryIds = form.getFieldValue('beneficiaryIds');

      let weightSum = 0;
      let beneficiaries = [];
      for (const i of beneficiaryIds) {
        const account = this.beneficiaryInput[i]['accountInput'].input.value;
        const weight = this.beneficiaryInput[i]['weightInput'].inputNumberRef.getCurrentValidValue();
        beneficiaries.push({ account: account, weight: weight * 100 });
        weightSum += weight;
      }
      this.props.updateDraft('beneficiaries', beneficiaries);

      if (weightSum > 90 || weightSum < 0) {
        this.setState({ beneficiariesValid: false });
      } else {
        this.setState({ beneficiariesValid: true });
      }
    }, 50);

    this.setState({ shouldRecalculateBeneficiary: false });
  };

  removeBeneficiary = (k) => {
    const { form } = this.props;
    // can use data-binding to get
    const beneficiaryIds = form.getFieldValue('beneficiaryIds');

    // can use data-binding to set
    form.setFieldsValue({
      beneficiaryIds: beneficiaryIds.filter(key => key !== k),
    });

    this.setState({ shouldRecalculateBeneficiary: true });
  };

  addBeneficiary = () => {
    currentBeneficiaryId++;
    const { form } = this.props;
    // can use data-binding to get
    const beneficiaryIds = form.getFieldValue('beneficiaryIds');
    const nextIds = beneficiaryIds.concat(currentBeneficiaryId);
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      beneficiaryIds: nextIds,
    });

    this.setState({ shouldRecalculateBeneficiary: true });
  };

  // MARK: - Custom Validators

  checkTags = (_, value, callback) => {
    const form = this.props.form;
    const tags = splitTags(form.getFieldValue('tags'));

    if (tags.length > 4) {
      callback('Please use only 4 tags');
    } else {
      this.handleTagsChange(tags);
      callback();
    }
  };

  checkUrl = (_, value, callback) => {
    if (!value || value.length === 0) {
      return callback();
    }
    value = addReferral(value);

    if (this.state.editMode) {
      this.props.updateDraft('url', value);
      return callback();
    }

    api.get('/posts/exists.json', { url: value }).then((res) => {
      if (res.result === 'OK') {
        this.props.updateDraft('url', value);
        callback();
      } else if (res.result === 'ALREADY_EXISTS') { // TODO: Go to the product page link
        this.props.updateDraft('url', '#');
        callback('The product link already exists.');
      } else {
        this.props.updateDraft('url', '#');
        callback('Invalid URL. Please include http or https at the beginning.');
      }
    }).catch(msg => {
      this.props.updateDraft('url', '#');
      callback('Service is temporarily unavailbe, Please try again later.');
    });
  };

  // MARK: - Handle uploads

  handleImagePreviewCancel = () => this.setState({ previewVisible: false });
  handleImagePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };

  // MARK: - Handle live updates

  handleTitleChange = (e) => this.props.updateDraft('title', sanitizeText(e.target.value) || initialState.draft.title);
  handleTaglineChange = (e) => this.props.updateDraft('tagline', sanitizeText(e.target.value) || initialState.draft.tagline);
  handleDescriptionChange = (e) => this.props.updateDraft('description', e.target.value || initialState.draft.description);
  handleImageChange = ({ fileList }) => {
    const images = fileList.map(function(f) {
      if (f.response && f.response.data && f.response.data.link) {
        return {
          name: f.name,
          link: f.response.data.link,
          width: f.response.data.width,
          height: f.response.data.height,
          type: f.response.data.type,
          id: f.response.data.id,
          deletehash: f.response.data.deletehash,
        }
      } else if (f.name && f.link) { // Handle Edit
        return {
          name: f.name,
          link: f.link,
          width: f.width,
          height: f.height,
          type: f.type,
          id: f.id,
          deletehash: f.deletehash,
        }
      }
      return null;
    });
    this.setState({ fileList });
    this.props.updateDraft('images', images.filter(x => !!x));
  };
  handleTagsChange = (tags) => this.props.updateDraft('tags', tags);

  initialValue = (field, defaultValue = null) => initialState.draft[field] === this.props.draft[field] ? defaultValue : this.props.draft[field];

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const formItemLayout = {
      labelCol: {
        lg: { span: 24 },
        xl: { span: 6 },
      },
      wrapperCol: {
        lg: { span: 24 },
        xl: { span: 18 },
      },
    };
    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        lg: { span: 24, offset: 0 },
        xl: { span: 18, offset: 6 },
      },
    };

    getFieldDecorator('beneficiaryIds', { initialValue: [] });
    const beneficiaryIds = getFieldValue('beneficiaryIds');
    const beneficiaries = beneficiaryIds.map((k, index) => {
      this.beneficiaryInput[k] = { accountInput: null, weightInput: null };

      return (
        <FormItem
          {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
          label={index === 0 ? (
            <span>
              Contributors&nbsp;
              <Tooltip title="You can add other beneficiaries from your post">
                <Icon type="question-circle-o" />
              </Tooltip>
            </span>
          ) : ''}
          required={false}
          key={k}
        >
          <Row gutter={8}>
            <Col span={14}>
              <Input
                addonBefore="@"
                placeholder="steemhunt"
                className="beneficiaries"
                ref={node => this.beneficiaryInput[k]['accountInput'] = node}
                onChange={this.onBeneficiariesChanged}
                maxLength="16"
              />
            </Col>
            <Col span={10}>
              <InputNumber
                min={1}
                max={90}
                formatter={value => `${value}%`}
                parser={value => value.replace('%', '')}
                onChange={this.onBeneficiariesChanged}
                ref={el => { this.beneficiaryInput[k]['weightInput'] = el; }}
                defaultValue={20}
              />
              <Icon
                className="delete-button"
                type="minus-circle-o"
                disabled={beneficiaryIds.length === 1}
                onClick={() => this.removeBeneficiary(k)}
              />
            </Col>
          </Row>
        </FormItem>
      );
    });

    return (
      <Form onSubmit={this.handleSubmit} className="post-form">
        <div className="guideline"><a onClick={() => this.setGuidelineVisible(true)}>Posting Guidelines</a></div>
        <Modal
          title="Posting Guidelines"
          visible={this.state.guidelineVisible}
          width={800}
          footer={null}
          onOk={() => this.setGuidelineVisible(false)}
          onCancel={() => this.setGuidelineVisible(false)}
        >
          <p>Steemhunt is a ranking community run by early-adopters who hunt &quot;effortlessly cool products.&quot; Please follow these guidelines when making a post. If your post fails to follow the guidelines, it may be excluded from the ranking.</p>
          <hr/>
          <h4>1. Post a &quot;Product,&quot; not a &quot;Business.&quot;</h4>
          <p>A business is larger and more vague than a product. For example, you may post a new Samsung Galaxy S9 phone - this is a product. You can’t post &quot;Samsung&quot; itself - this is a business. Also, you can’t post a local product. Steemhunt is a global community, so you should bring something that everyone can enjoy.</p>
          <h4>2. Types of Products to Post</h4>
          <p>Steemhunt generally covers unique IT or hardware products, including:</p>
          <ul>
            <li>Web services</li>
            <li>Mobile apps</li>
            <li>Games</li>
            <li>API, IT solutions, bots, open sources or other types of software</li>
            <li>Tech gadgets</li>
            <li>Unique items</li>
          </ul>
          <h4>3. Language - English Only</h4>
          <p>Steemhunt runs a single ranking board globally, so please post and comment in English.</p>
          <h4>4. Product Link</h4>
          <p>All posts must have a valid website. You can only provide an official website of the product, app download link, or e-commerce site where users can make purchases. The following examples WILL NOT be accepted:</p>
          <ul>
            <li>Newspaper articles</li>
            <li>Listicles (like &quot;00 cool inventions …&quot;)</li>
            <li>Blog posts (unless it’s a launching post.)</li>
            <li>Social media posts such as Facebook, Twitter, Youtube, or Instagram</li>
          </ul>
          <h4>5. Plagiarism and Copyright</h4>
          <p>Write a sentence and description with your own words. Do not copy and paste from the product’s website or other sites. You can however quote some content from a site, but you must use quotes and cite the source properly.</p>
          <h4>6. Do Not Use Upvoting Bot</h4>
          <p>Using an upvoting bot service may disrupt our daily ranking. This is a product community where &quot;people&quot; actually see the product you’ve hunted, and upvote the products they think are cool.</p>
          <h4>7. Post &quot;New&quot; Products</h4>
          <p>Steemhunt is about cool &quot;new&quot; products. Please make sure that your hunt is about something that’s recently introduced. If the product is not new, there must be strong reason to post. For example, the product must be substantially updated or upgraded in a way that has a positive effect on users. Or, it must be a product that not many people have observed and may be interesting to discover.</p>
          <h4>8. Quality of the Post</h4>
          <p>As a hunter, you need to post a cool product with well-structured comments and screenshots so that the users can see the benefit of the product quickly without checking the products website. Your post will be hidden if you</p>
          <ul>
            <li>use non-related words/descriptions about the product.</li>
            <li>attach non-related screenshot images or videos.</li>
            <li>share any scams or highly suspicious cryptocurrency/fin-tech products.</li>
          </ul>
          <hr/>
          <p>These posting guidelines are being continuously developed by our community. Feel free to suggest any opinions on how to make Steemhunt a cooler ranking community. You can join our <a href="https://discord.gg/mWXpgks" target="_blank" rel="noopener noreferrer">Discord Chat</a> and make any suggestions.</p>
        </Modal>
        <FormItem
          {...formItemLayout}
          label="Product Link"
        >
          {getFieldDecorator('url', {
            validateTrigger: ['onBlur'],
            initialValue: this.initialValue('url'),
            rules: [
              { required: true, message: 'Product link cannot be empty', whitespace: true },
              { validator: this.checkUrl },
            ],
          })(
            <Input placeholder="https://steemit.com" />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="Name of Product"
        >
          {getFieldDecorator('title', {
            initialValue: this.initialValue('title'),
            rules: [{ required: true, message: 'Name cannot be empty', whitespace: true }],
          })(
            <Input
              placeholder="Steemit"
              maxLength="30"
              onChange={this.handleTitleChange} />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="Short Description"
          help="Describe what you’re posting in 60 characters or less."
        >
          {getFieldDecorator('tagline', {
            initialValue: this.initialValue('tagline'),
            rules: [ { required: true, message: 'Short description cannot be empty', whitespace: true } ],
          })(
            <Input
              placeholder="A social media where everyone gets paid for participation"
              maxLength="60"
              onChange={this.handleTaglineChange}
            />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="Images"
        >
          <div className="dropbox">
            {getFieldDecorator('images', {
              rules: [{ required: true, message: 'You must upload at least one image' }],
            })(
              <Upload.Dragger name="image"
                action="https://api.imgur.com/3/image"
                headers={{
                  'Authorization': 'Client-ID 32355fe756394b2',
                  'Cache-Control': null,
                  'X-Requested-With': null
                }}
                listType="picture-card"
                fileList={this.state.fileList}
                onPreview={this.handleImagePreview}
                onChange={this.handleImageChange}
                multiple={true}
                accept="image/*"
              >
                <p className="ant-upload-drag-icon">
                  <Icon type="inbox" />
                </p>
                <p className="ant-upload-hint">Click or drag image(s) to this area to upload (10MB Max)</p>
              </Upload.Dragger>
            )}
          </div>
          <Modal visible={this.state.previewVisible} footer={null} onCancel={this.handleImagePreviewCancel}>
            <img alt="Preview" style={{ width: '100%' }} src={this.state.previewImage} />
          </Modal>
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="Hunter's comment"
        >
          {getFieldDecorator('description', {
            initialValue: this.initialValue('description'),
          })(
            <Input.TextArea
              placeholder="Comment on this product..."
              rows={4}
              onChange={this.handleDescriptionChange} />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="Tags"
        >
          {getFieldDecorator('tags', {
            validateTrigger: ['onChange', 'onBlur'],
            initialValue: this.initialValue('tags', []).join(' '),
            rules: [{ validator: this.checkTags }],
          })(
            <Input
              placeholder="Up to 4 tags, separated by a space"
            />
          )}
        </FormItem>

        {!this.state.editMode && beneficiaries}

        {!this.state.editMode &&
          <FormItem {...formItemLayoutWithOutLabel}>
            {!this.state.beneficiariesValid && (
                <div className="ant-form-item-control has-error">
                  <p className="ant-form-explain">Sum of reward values must be less than or equal to 90%</p>
                </div>
              )
            }
            {beneficiaryIds.length < 5 &&
              <Button type="dashed" onClick={this.addBeneficiary}>
                <Icon type="plus" /> Add makers or contributors
              </Button>
            }
            <p className="text-small top-margin">
              10% beneficiaries will be used for Steemhunt operation, and another 5% for sponsors who&nbsp;
              <a href="https://steemit.com/steemhunt/@steemhunt/introducing-incentives-for-steemhunt-sponsors" target="_blank" rel="noopener noreferrer">
                delegated Steem Power to @steemhunt.
              </a>
              <br/>
              {timeUntilMidnightSeoul()}
            </p>
          </FormItem>
        }

        <FormItem {...formItemLayoutWithOutLabel}>
          <Button
            type="primary"
            htmlType="submit"
            className="submit-button pull-right round-border padded-button"
            loading={this.props.isPublishing}
          >
            {this.state.editMode ? 'UPDATE POST' : 'POST NOW'}
          </Button>
        </FormItem>
      </Form>
    );
  }
}

const WrappedPostForm = Form.create()(PostForm);

const mapStateToProps = () => createStructuredSelector({
  me: selectMe(),
  draft: selectDraft(),
  post: selectCurrentPost(),
  isPublishing: selectIsPublishing(),
});

const mapDispatchToProps = (dispatch, props) => ({
  getPost: (author, permlink) => dispatch(getPostBegin(author, permlink, true)),
  setCurrentPostKey: key => dispatch(setCurrentPostKey(key)),
  updateDraft: (field, value) => dispatch(updateDraft(field, value)),
  resetDraft: () => dispatch(resetDraft()),
  publishContent: (editMode) => dispatch(publishContentBegin(props, editMode)),
});

export default connect(mapStateToProps, mapDispatchToProps)(WrappedPostForm);

