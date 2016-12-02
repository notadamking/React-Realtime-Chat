import React from 'react';
import ApolloClient, { createNetworkInterface, addTypename } from 'apollo-client';
import { ApolloProvider } from 'react-apollo';
import { renderToStringWithData } from 'react-apollo/server';
import { RouterContext, match } from 'react-router';
import { createLocation } from 'history/LocationUtils';
import { renderToStaticMarkup } from 'react-dom/server';
import 'isomorphic-fetch';

import { Html } from '../../client/components';
import configureStore from '../../client/redux/configureStore';
import routes from '../../client/routes';
import config from '../../config';

export default (req, res) => {
  if (__DEVELOPMENT__) {
    // clear require() cache if in development mode
    // (makes asset hot reloading work)
    webpackIsomorphicTools.refresh();
  }

  const location = createLocation(req.url);

  match({ routes, location }, (error, redirectLocation, renderProps) => {
    if (error) {
      return res.status(500).send(error.message);
    } else if (redirectLocation) {
      return res.redirect(302, redirectLocation.pathname + redirectLocation.search);
    } else if (!renderProps) {
      return res.status(404).send('Not Found');
    }
    const client = new ApolloClient({
      ssrMode: true,
      networkInterface: createNetworkInterface({
        uri: `http://${config.server.host}:${config.server.port}${config.graphqlEndpoint}`,
        credentials: 'same-origin',
        headers: req.headers,
      }),
      queryTransformer: addTypename,
      dataIdFromObject: (result) => {
        if (result.id && result.__typename) {
          return result.__typename + result.id;
        }
        return null;
      },
    });
    const store = configureStore({ client });
    const component = (
      <ApolloProvider client={client} store={store}>
        <RouterContext {...renderProps} />
      </ApolloProvider>
    );

    renderToStringWithData(component).then((content) => {
      const data = client.store.getState().apollo.data;
      const assets = webpackIsomorphicTools.assets();
      const initialState = store.getState();
      initialState.apollo.queries = {};

      res.status(200);

      const page = renderToStaticMarkup(
        <Html
          apolloState={{ apollo: { data } }}
          assets={assets}
          content={content}
          initialState={initialState}
        />
      );

      res.send(`<!doctype html>\n${page}`);
      res.end();
    }).catch((err) => console.error('RENDERING ERROR:', err));
  });
};
