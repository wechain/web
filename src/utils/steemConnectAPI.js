import sc2 from 'sc2-sdk';

const api = sc2.Initialize({
  app: 'steemhunt.com',
  callbackURL: process.env.REACT_APP_STEEMCONNECT_REDIRECT_URL,
  accessToken: 'access_token',
  scope: [ 'login', 'vote', 'comment', 'delete_comment', 'comment_options', 'custom_json' ],
});

export default api;