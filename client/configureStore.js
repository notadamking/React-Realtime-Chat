import { createStore, combineReducers, applyMiddleware, compose } from 'redux';

export default ({ initialState, client }) => createStore(
  combineReducers({
    apollo: client.reducer(),
  }),
  initialState,
  compose(
      applyMiddleware(client.middleware()),
      // If you are using the devToolsExtension, you can add it here also
      global.window && window.devToolsExtension ? window.devToolsExtension() : f => f,
  )
);
