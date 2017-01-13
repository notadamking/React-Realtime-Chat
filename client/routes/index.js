import React from 'react';
import { IndexRedirect, Route } from 'react-router';

import MainLayout from './layouts/MainLayout';
import Messages from './Messages';
import NotFound from './NotFound';

export default (
  <Route component={MainLayout} path='/'>
    <IndexRedirect to='/messages/general' />
    <Route component={Messages} path='/messages/:channel' room='home' />
    <Route component={Messages} path='/:room/messages/:channel' />

    { /* Catch all route */ }
    <Route component={NotFound} name='404' path='*' status={404} />
  </Route>
);
