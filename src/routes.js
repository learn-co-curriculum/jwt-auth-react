import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './components/App';
import LogInPage from './components/LogInPage';
import SpaceFormationContainer from './components/SpaceFormationContainer'

export default (
  <Route path="/" component={App}>
    <Route path="login" component={LogInPage} />
    <IndexRoute component={SpaceFormationContainer} onEnter={requireAuth} />
  </Route>
);

function requireAuth(nextState, replace) {
  if (!(!!localStorage.jwt)) {
    replace({
      pathname: '/login',
      state: { nextPathname: nextState.location.pathname }
    })
  }
}

