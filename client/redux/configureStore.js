import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { reducer as form } from 'redux-form';
import thunk from 'redux-thunk';

import { auth, messages } from './reducers';

export default ({ initialState, client }) => createStore(
  combineReducers({
    apollo: client.reducer(),
    form,
    auth,
    messages,
  }),
  initialState,
  compose(
      applyMiddleware(client.middleware(), thunk),
      // If you are using the devToolsExtension, you can add it here also
      global.window && window.devToolsExtension ? window.devToolsExtension() : f => f,
  )
);
