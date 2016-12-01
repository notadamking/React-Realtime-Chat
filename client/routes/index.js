import React from 'react';
import { IndexRoute, Route } from 'react-router';

import Home from './Home';
import MainLayout from './layouts/MainLayout';
import NotFound from './NotFound';

export default (
  <Route component={MainLayout} path='/'>
    <IndexRoute component={Home} />

    { /* Catch all route */ }
    <Route component={NotFound} name='404' path='*' status={404} />
  </Route>
);
