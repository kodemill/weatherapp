import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import * as reducers from './reducers';
import callApiMiddleware from './call-api-middleware';
import { routerReducer as routing } from 'react-router-redux';

export default initialState => createStore(
  combineReducers({
    ...reducers,
    routing,
  }),
  initialState,
  compose(
    applyMiddleware(
      thunk,
      callApiMiddleware,
      // createLogger()
    ),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  )
);
