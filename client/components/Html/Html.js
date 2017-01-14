import React, { PropTypes } from 'react';
import Helmet from 'react-helmet';

const Html = ({ apolloState, assets, content, initialState }) => {
  const head = Helmet.rewind();

  return (
    <html>
      <head>
        {head.title.toComponent()}
        {head.meta.toComponent()}

        <meta charSet='UTF-8' />
        <meta content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no' name='viewport' />
        <meta content='IE=edge,chrome=1' httpEquiv='X-UA-Compatible' />
        <link href='https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.6/semantic.min.css' rel='stylesheet' type='text/css' />

        <link href='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAIAAAD8GO2jAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2lJREFUeNqMVk1vGkEMndmu4MLmkOWQoCqkh0APqAdUVNpKiXLux/+tFKlSDlEitcm15RI4BBBiucCFjdDUs571eL1L1EEC450d28/P9ujvH7+qbBljFFtaa9SgAN9ij9Xnb/LNdBrKIUn0rNKGKi1vvkpPQqi0syYiIBvlN7lt2kM7C6ErE2gr6BfcpCXO4mg4AURlCg6ZHCIrGuk1Kckp/q20P13u1NknW4E7VMkAreE8ONTLEA0Lpep0jDvgSReZIGRQbkSNuBnT0+ggOowP0X3uB0cC1qvu6453Te8lT3/Qv7i8SLfpbDrDN4efh4MPg91ut1gsMBprqYSEY1EledA1fNo+bcN3kiS0HzVgz7pMwGrJhRBs5glS+EuVQbkDZKIoAmHyOEEP2m/s6WmaJsnKRZ5XoijJkIrAWtKG8sP5dNw6ds46Puhmswni+HFsmclKnZe9M0BmiXD4uFavdbod3ERC713PRZDhA2GhJlkmmBuOj0vkt+EXbhl5BnY6bzvDT0P1f+v25nb0Z8SZ6rikMwO51gcGf8G7xkEDNtRqtfPLc1Be/7zebreYkv77PghXP65g5ypZWT3RP3ufjIWeOb6A7LPNZrNerymfIE/GE4wSKgAZNX2aenIrhwF5jzZCOpg3Ly4jf1bIlozsWF+zpxmxQ+liN81UWBaBMrIjOhpoZwkpBGl0hW0U1vNmvXGFooycHMbHFJY7OO4jwqAB6BOkieMYM9GrW818Oge4CuzUDCIqcW4GDsU00iKm0jrrnqFw/+t+uVxyHhZA9jRlZuAvOg5wgyXI8N3NHb55cnoCxgCxh98P6A1gBR/uIkc7LGQ4xx0WFA4lAEAAwuA76Ph85jR82ogJmje7whD37RBfOGodYYaJ4GgSMKFZW25BHiiVzwMaOx47KLF6DfPpupAxkFioO99Eiye6GhYRFEZYcdi2Wi0sMYCYJwYCek6fOdC+GRt5zQmlC8wSdGNgiG3RxlX46O8ITfojlBHDkuLwzU7cscr1LLqhd5y3hfK8Iogq7lLZ8jZK9zU+9co3KK4P+LnCca9nG8T9RedLXBL8tUUMIGwvojXtc99dthiqLnoWViADNHvvAGL2uROVFtcykZjwhZdFcAJc6TjbwTEM3QAq3lP40VSThRxU3U0rgf0nwADpJQebhAz3/AAAAABJRU5ErkJggg==' rel='shortcut icon' sizes='16x16 32x32 48x48' type='image/png' />
        <link href='/styles/main.css' rel='stylesheet' type='text/css' />
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
