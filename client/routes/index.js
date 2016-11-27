import React from 'react';
import { IndexRoute, Route, Router, browserHistory } from 'react-router';

import App from './App';
import Home from './Home';
import NotFound from './NotFound';

export default (
  <Router history={browserHistory}>
    <Route component={App} path='/'>
      <IndexRoute component={Home} />

      { /* Catch all route */ }
      <Route component={NotFound} name='404' path='*' status={404} />
    </Route>
  </Router>
);
