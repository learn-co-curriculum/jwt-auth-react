import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './components/App';
import LogInPage from './components/LogInPage';
import SpaceFormationContainer from './components/SpaceFormationContainer'
import auth from './auth/auth';

export default (
  <Route path="/" component={App}>
    <Route path="login" component={LogInPage} />
    <IndexRoute component={SpaceFormationContainer} onEnter={requireAuth} />
  </Route>
);

function requireAuth(nextState, replace) {
  console.log(auth.loggedIn());
  if (!auth.loggedIn()) {
    replace({
      pathname: '/login',
      state: { nextPathname: nextState.location.pathname }
    })
  }
}

function redirectIfLoggedIn(nextState, replace) {
  console.log(auth.loggedIn());
  if (auth.loggedIn()) {
    replace({
      pathname: '/home',
      state: { nextPathname: nextState.location.pathname }
    })
  }
}