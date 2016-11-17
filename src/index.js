import React from 'react';
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import {createStore, applyMiddleware} from 'redux'
import ReduxPromise from 'redux-promise'
import { Router, browserHistory } from 'react-router';
import routes from './routes';
import rootReducer from './reducers'
import App from './components/App'

const store = createStore(rootReducer, applyMiddleware(ReduxPromise))

ReactDOM.render(
  <Provider store={store}>
     <Router history={browserHistory} routes={routes} />
  </Provider>,
  document.getElementById('container')
);


