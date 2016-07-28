import React from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, Redirect, browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import { syncHistoryWithStore } from 'react-router-redux';
import createStore from './redux/create-store';
import startup from './redux/startup';

import injectTapEventPlugin from 'react-tap-event-plugin';

import Layout from './container/layout';
import Create from './container/create';
import Settings from './container/settings';
import List from './container/list';

injectTapEventPlugin();

const store = createStore();
const history = syncHistoryWithStore(browserHistory, store);
startup(store);

export default () => {
  render(
    <Provider store={store}>
      <Router history={history}>
        <Route path="/" component={Layout}>
          <IndexRoute component={Create} />
          <Route path="create" component={Create} />
          <Route path="settings" component={Settings} />
          <Route path="list" component={List} />
          <Redirect path="*" to="/" />
        </Route>
      </Router>
    </Provider>,
    document.getElementById('app')
  );
};
