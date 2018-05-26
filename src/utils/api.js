import 'whatwg-fetch';
import { getEncryptedToken } from 'utils/token';
import { calculateContentPayout } from 'utils/helpers/steemitHelpers';

const API_ROOT = process.env.REACT_APP_API_ROOT;

function parseJSON(res) {
  return res.json();
}

function checkError(json) {
  if (json.error) {
    throw new Error(json.error);
  }

  return json
}

function getQueryString(params) {
  return Object.keys(params)
    .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
    .join('&');
}

function request(method, path, params, shouldAuthenticate) {
  var qs = '';
  var body;
  var headers = (params && params.headers) || {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  };

  if (shouldAuthenticate) {
    headers['Authorization'] = 'Token token=' + getEncryptedToken();
  }

  if (['GET', 'DELETE'].indexOf(method) > -1) {
    qs = '?' + getQueryString(params || {});
  } else { // POST or PUT
    body = JSON.stringify(params || {});
  }
  var url = API_ROOT + path + qs;

  return fetch(url, { method, headers, body })
    .then(parseJSON)
    .then(checkError);
}

export default {
  get: (path, params, shouldAuthenticate = false) => request('GET', path, params, shouldAuthenticate),
  post: (path, params, shouldAuthenticate = false) => request('POST', path, params, shouldAuthenticate),
  put: (path, params, shouldAuthenticate = false) => request('PUT', path, params, shouldAuthenticate),
  delete: (path, params, shouldAuthenticate = false) => request('DELETE', path, params, shouldAuthenticate),
  setModerator: (post) => request('PATCH', `/posts/set_moderator/@${post.author}/${post.permlink}.json`, null , true),
  moderatePost: (post, is_active, is_verified) => request('PATCH', `/posts/moderate/@${post.author}/${post.permlink}.json`, {
    post: {
      is_active: is_active,
      is_verified: is_verified,
    }
  }, true),
  refreshPost: (post) => request('PATCH', `/posts/refresh/@${post.author}/${post.permlink}.json`, {
    post: {
      payout_value: calculateContentPayout(post) || post.payout_value,
      active_votes: post.active_votes,
      children: post.children,
    }
  }, true),
  increaseCommentCount: (post) => request('PATCH', `/posts/refresh/@${post.author}/${post.permlink}.json`, {
    post: {
      children: post.children + 1,
    }
  }, true),
};
