import React from 'react';
import ReactDOM from 'react-dom';
import ApolloClient, { createNetworkInterface, addTypename } from 'apollo-client';
import { AppContainer } from 'react-hot-loader';
import { ApolloProvider } from 'react-apollo';
import { Client } from 'subscriptions-transport-ws';
import 'isomorphic-fetch';

import config from '../config';
import addGraphQLSubscriptions from './utils/subscriptions';
import configureStore from './configureStore';
import routes from './routes';

const wsClient = new Client('ws://localhost:3030');

const networkInterface = createNetworkInterface({
  uri: config.graphqlEndpoint,
  opts: {
    credentials: 'same-origin',
  },
  transportBatching: true,
});

const networkInterfaceWithSubscriptions = addGraphQLSubscriptions(
  networkInterface,
  wsClient,
);

const client = new ApolloClient({
  networkInterface: networkInterfaceWithSubscriptions,
  queryTransformer: addTypename,
  dataIdFromObject: (result) => {
    if (result.id && result.__typename) {
      return result.__typename + result.id;
    }
    return null;
  },
  // shouldBatch: true,
  initialState: window.__APOLLO_STATE__,
  ssrForceFetchDelay: 100,
});

const initialState = window.__INITIAL_STATE__;
const store = configureStore({ initialState, client });

ReactDOM.render(
  <AppContainer>
    <ApolloProvider client={client} store={store}>
      {routes}
    </ApolloProvider>
  </AppContainer>,
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept('./routes', () => {
    const nextRoutes = require('./routes').default; // eslint-disable-line global-require

    ReactDOM.render(
      <AppContainer>
        <ApolloProvider client={client} store={store}>
          {nextRoutes}
        </ApolloProvider>
      </AppContainer>,
      document.getElementById('root')
    );
  });
}
