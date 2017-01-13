import React from 'react';
import { IndexRedirect, Route } from 'react-router';

import { setShouldScrollToBottom } from '../redux/actions/messages';
import MainLayout from './layouts/MainLayout';
import Messages from './Messages';
import NotFound from './NotFound';

export default (store) => (
  <Route component={MainLayout} path='/'>
    <IndexRedirect to='/messages/general' />
    <Route
      component={Messages}
      path='/messages/:channel'
      room='home'
      onEnter={() => setTimeout(() => store.dispatch(setShouldScrollToBottom()), 500)}
    />
    <Route
      component={Messages}
      path='/:room/messages/:channel'
      onEnter={() => setTimeout(() => store.dispatch(setShouldScrollToBottom()), 500)}
    />

    { /* Catch all route */ }
    <Route component={NotFound} name='404' path='*' status={404} />
  </Route>
);
