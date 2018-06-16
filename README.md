# Steemhunt front-end

This project was bootstrapped with [Steemiz](https://github.com/steemiz/steemiz) and [Create React App](https://github.com/facebookincubator/create-react-app) projects.


## Stacks
- React 16 / Redux 3
- Ant Design for front-end frameworks
- SteemConnect v2

## Development Setup

1. `npm install`
2. Setup local API server (back-end) with the instruction [here](https://github.com/Steemhunt/api/blob/master/README.md)
*(Both `api` and `web` directory should be on the same parent directory to use our [Foreman script](https://github.com/Steemhunt/api/blob/master/Procfile))*
3. Once you finish setting up `api` directory, type:
```rails start```
to start both API (back-end) and Node server (front-end) on local port 3000 and 3001 respectively.


## Deploy
```
git push && npm run build && cd ../api && git push && bundle exec cap production deploy
```