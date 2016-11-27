import Helmet from 'react-helmet';
import React from 'react';
import ApolloClient, { createNetworkInterface, addTypename } from 'apollo-client';
import { ApolloProvider } from 'react-apollo';
import { renderToStringWithData } from 'react-apollo/server';
import { RouterContext, match } from 'react-router';
import { createLocation } from 'history/LocationUtils';
import { renderToStaticMarkup } from 'react-dom/server';
import 'isomorphic-fetch';

import Html from '../../client/components/Html';
import configureStore from '../../client/configureStore';
import routes from '../../client/routes';
import config from '../../config';

export default (req, res) => {
  const location = createLocation(req.url);

  match({ routes, location }, (error, redirectLocation, renderProps) => {
    if (error) {
      return res.status(500).send(error.message);
    } else if (redirectLocation) {
      return res.redirect(302, redirectLocation.pathname + redirectLocation.search);
    } else if (!renderProps) {
      return res.status(404).send('Not Found');
    }
    const assets = require('../../build/assets.json'); // eslint-disable-line global-require, import/newline-after-import
    const head = Helmet.rewind();
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
    const initialState = store.getState();

    const component = (
      <ApolloProvider client={client} store={store}>
        <RouterContext {...renderProps} />
      </ApolloProvider>
    );

    renderToStringWithData(component).then((content) => {
      const data = client.store.getState().apollo.data;
      res.status(200);

      const page = renderToStaticMarkup(
        <Html
          apolloState={{ apollo: { data } }}
          assets={assets}
          content={content}
          head={head}
          initialState={initialState}
        />
      );

      res.send(`<!doctype html>\n${page}`);
      res.end();
    }).catch((err) => console.error('RENDERING ERROR:', err));
  });
};
