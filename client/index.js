import React from 'react';
import ReactDOM from 'react-dom';
import ApolloClient, { createNetworkInterface, addTypename } from 'apollo-client';
import { Router, browserHistory } from 'react-router';
import { ApolloProvider } from 'react-apollo';
import { AppContainer } from 'react-hot-loader';
import { Client } from 'subscriptions-transport-ws';
import 'isomorphic-fetch';

import config from '../config';
import addGraphQLSubscriptions from './utils/subscriptions';
import configureStore from './redux/configureStore';
import routes from './routes';

const networkInterface = createNetworkInterface({
  uri: config.graphqlEndpoint,
  opts: {
    credentials: 'same-origin',
  },
  transportBatching: true,
});

networkInterface.use([{
  applyMiddleware(req, next) {
    if (!req.options.headers) {
      req.options.headers = {};
    }
    req.options.headers.authorization = localStorage.getItem(config.authTokenName);
    next();
  }
}]);

const wsClient = new Client(`ws://${config.server.host}`);
const networkInterfaceWithSubscriptions = addGraphQLSubscriptions(networkInterface, wsClient);

const client = new ApolloClient({
  networkInterface: networkInterfaceWithSubscriptions,
  queryTransformer: addTypename,
  dataIdFromObject: (result) => {
    if (result.id && result.__typename) {
      return result.__typename + result.id;
    }
    // console.log('no data id from object could be found', result);
    return null;
  },
  shouldBatch: true,
  initialState: window.__APOLLO_STATE__,
  ssrForceFetchDelay: 100,
});

const initialState = window.__INITIAL_STATE__;
const store = configureStore({ initialState, client });

function render() {
  ReactDOM.render(
    <AppContainer>
      <ApolloProvider client={client} store={store}>
        <Router history={browserHistory}>
          {routes}
        </Router>
      </ApolloProvider>
    </AppContainer>,
    document.getElementById('root')
  );
}

render();

if (module.hot) {
  module.hot.accept('./routes', () => {
    const newRoutes = require('./routes').default; // eslint-disable-line
    render(); // although it doesn't seem like it, the routes are actually being updated
  });
}
