# Steemhunt front-end

This project was bootstrapped with [Steemiz](https://github.com/steemiz/steemiz) and [Create React App](https://github.com/facebookincubator/create-react-app) projects.


## Stacks
- React 16 / Redux 3
- Ant Design for front-end frameworks
- SteemConnect v2

## Development Setup

1. Create environment file on root directory
```
cat > env.local

# Copy and paste settings below:
REACT_APP_API_ROOT="http://localhost:3001"
REACT_APP_STEEM_API_URL="https://api.steemit.com"
REACT_APP_STEEMCONNECT_REDIRECT_URL="http://localhost:3000/auth/steemconnect/callback"
REACT_APP_STEEMCONNECT_IMG_HOST="https://img.busy.org"
```

2. `npm install`
3. Setup local API server (back-end) with the instruction [here](https://github.com/Steemhunt/api/blob/master/README.md)
*(Both `api` and `web` directory should be on the same parent directory to use our [Foreman script](https://github.com/Steemhunt/api/blob/master/Procfile))*
4. Once you finish setting up `api` directory, type:
```rails start```
to start both API (back-end) and Node server (front-end) on local port 3000 and 3001 respectively.


## Deploy
```
git push && npm run build && cd ../api && git push && bundle exec cap production deploy
```