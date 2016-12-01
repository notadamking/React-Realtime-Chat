import React, { PropTypes } from 'react';
import Helmet from 'react-helmet';

const Html = ({ apolloState, assets, content, initialState }) => {
  const head = Helmet.rewind();

  return (
    <html>
      <head>
        <meta charSet='UTF-8' />
        <meta content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no' name='viewport' />
        <meta content='IE=edge,chrome=1' httpEquiv='X-UA-Compatible' />
        <link href='https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.6/semantic.min.css' rel='stylesheet' type='text/css' />
        {head.meta.toComponent()}
        {head.title.toComponent()}
      </head>
      <body>
        <div dangerouslySetInnerHTML={{ __html: content }} id='root' />
        <script dangerouslySetInnerHTML={{ __html: `window.__INITIAL_STATE__ = ${JSON.stringify(initialState)}` }} />
        <script dangerouslySetInnerHTML={{ __html: `window.__APOLLO_STATE__ = ${JSON.stringify(apolloState)}` }} />

        {Object.keys(assets.javascript).map((script, i) => {
          return <script key={i} src={assets.javascript[script]} />;
        })}
      </body>
    </html>
  );
};

Html.propTypes = {
  apolloState: PropTypes.object,
  assets: PropTypes.object.isRequired,
  content: PropTypes.string.isRequired,
  initialState: PropTypes.object
};

export default Html;
