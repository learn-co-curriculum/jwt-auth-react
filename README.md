# JWT Auth with React + Redux

## Objectives

* Implement an authentication system between React and Rails using JWT
* Log in users with your React app and authorize them with your Rails app 
* Log out users from your React app

## Introduction

In this code-along exercise, we'll be building out an authenticatino system for a React app that is already up and running. Our React app, housed in this repo, consumes data from a Rails 5 API that serves JSON data on different space formations--stars, nebulas, galaxies, that sort of thing––including their photographs, courtesy fo the Hubble Telescope (pretty cool, right?)

You'll need to clone down the Rails API and keep it running on `localhost:3000` in order for our React app to work with it. 

Clone down [this repo](https://github.com/learn-co-curriculum/rails-api-jwt-auth/tree/solution) and run:

* `bundle install`
* `rake db:create; rake db:migrate`, `rake db:seed`

We've seeded our database with one dummy user, Liz Lemon's boyfriend, astronaut Mike Dexter. 

![](https://s3-us-west-2.amazonaws.com/curriculum-content/web-development/react/astronautMikeDexter.gif) 

Later on, we'll log in with his credentials:

```
email: mike@nasa.com
password: spaceRulez
```

Once you have your Rails API up and running, you're ready to get started. 

## The React App

Our React is already up and running, it just doesn't have any authentication. Before we add our new log in feature, let's familiarize ourselves with the app. 

Clone down this repo, run `npm install` and `npm start`. You should see...nothing?! But wait! Where are our pictures of space? 

Well, our Rails API requires authentication. It only allows through requests that have a header of `Authorization` with a value of `Bearer <some JWT>`. We haven't provided users an opportunity to log in and we are definitely not sending requests that include this header. 

In order to get our pictures of space, as shown below, we'll need to build out authentication system. 

![](https://s3-us-west-2.amazonaws.com/curriculum-content/web-development/react/Screen+Shot+2016-11-17+at+1.29.43+PM.png)

Before we build out that feature, set's break down the current structure of our app. 

### Routes

Start by opening up the `src/routes.js` file. You should see this:

```js
import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './components/App';
import SpaceFormationContainer from './components/SpaceFormationContainer'

export default (
  <Route path="/" component={App}>
    <IndexRoute component={SpaceFormationContainer} onEnter={requireAuth} />
  </Route>
);
```
We're using React Router to set up a basic index route. The root path maps to the `App`component, and we have one child route, our `IndexRoute`, that maps to the `SpaceFormationContainer` component. 

Let's open up these components now. 

### The Components

The `App` component is a container component that renders `this.props.children`. Thanks to React Router, this will be populated by the components rendered by `App`'s child routes. Right now we just have one child route + component, our `IndexRoute`/`SpaceFormationContainer` route/component pair. Later, we'll add another child to render the log in page. 

`SpaceFormationContainer` uses `connect` and `mapStateToProps` to get the space formation objects from space. It uses `mapDispatchToProps` to access the `spaceFormationActions` and dispatch the `fetchSpaceFormations` action creator function as-needed. 

`SpaceFormationContainer` in turn renders a child presentational component, `SpaceList`. 

`SpaceList` is a simple functional component that iterates over and display our space formation objects. 

Take a few minutes and look through the actions and reducer to get comfortable with how data flows through our app. 

## Instructions

### Step 1: Log In Route and Component 

If our users are going to be able to log in, we need to give them a log in page and form. We'll build a component, `LogInPage`, to contain this form, and we'll create a route that maps to this component. 

Let's start with the route:

```js
// src/routes.js

import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './components/App';
import LogInPage from './components/LogInPage';
import SpaceFormationContainer from './components/SpaceFormationContainer'

export default (
  <Route path="/" component={App}>
    <Route path="login" component={LogInPage} />
    <IndexRoute component={SpaceFormationContainer} />
  </Route>
);
```

Now let's build out that component. Our component needs to be able to capture the form input (a user's email and password) and trigger an action that submits that input to the Rails API's `/login` route. Let's get our form up and running first, then we'll worry about developing that action.

```js
// src/components/LogInPage.js
import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as sessionActions from '../actions/sessionActions';

class LogInPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {credentials: {email: '', password: ''}}
    this.onChange = this.onChange.bind(this);
    this.onSave = this.onSave.bind(this);
  }

  onChange(event) {
    const field = event.target.name;
    const credentials = this.state.credentials;
    credentials[field] = event.target.value;
    return this.setState({credentials: credentials});
  }

  onSave(event) {
    event.preventDefault();
    // here we will dispatch an action to send the log in request to our Rails API
  }

  render() {
    return (
      <div>
        <form>
          <label>email</label>
          <input 
            type="text"
            name="email"
            value={this.state.credentials.email}
            onChange={this.onChange}/>

          <label>password</label>
          <input
            type="password"
            name="password"
            value={this.state.credentials.password}
            onChange={this.onChange}/>

          <input
            type="submit"
            className="btn btn-primary"
            onClick={this.onSave}/>
        </form>
      </div>
  );
  }
}

export default LogInPage;
```

Our `LogInPage` component maintains its own internal state to make it easier to dynamically capture form data when the user fills out the email and password input fields. 

Okay, we need to build an action that, when dispatched, can send the log in request to the Rails API. 

### Step 2: Log In Action and Reducer

Let's think about what needs to happend to enact our log in cycle.

* User will enter email and password into form
* Our app will take that info and send it to Rails
* If Rails can authenticate that user with the given password, it will issue and return a JWT
* React will receive the JWT and store it somewhere from where it can later retrive it to make subsequent authorized requests to the API. 

So, we'll build an action creator function in a file, `src/actions/sessionActions`, that will send the log in request to Rails and get back the JWT. 

Then, it will send the payload of that JWT to a special reducer, the `sessionReducer`, which will handle storing the token. More on token storage coming up. 

Let's define our action and teach our `LogInPage` component to dispatch it when the user submits the form. 

```js
// src/actions/sessionActions.js

export function logInUser(credentials) {
  const jwt = logIn(credentials)
  return {type: 'LOG_IN', payload: jwt}
}

function logIn(credentials) {
  const request = new Request('http://localhost:3000/login', {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json'
      }), 
      body: JSON.stringify({auth: credentials})
    });


    return fetch(request).then(response => {
      return response.json();
    }).catch(error => {
      return error;
    }).then(tokenPayload => {
      return tokenPayload.jwt
    });
}
```

Our `logInUser` action creator function calls on a helper function, `logIn`, that uses `fetch` to send a `POST` request to our Rails log in endpoint at `http://localhost:3000/login`. 

The Promise returned by this request will be resolved by the Redux Promise middleware, which you should have noticed we used when we initialized our store in `src/index.js`. 

Our `LogInPage` component should dispatch this action when the user submits the form. So, we'll need to use `mapDispatchToProps`.

```js
import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as sessionActions from '../actions/sessionActions';

class LogInPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {credentials: {email: '', password: ''}}
    this.onChange = this.onChange.bind(this);
    this.onSave = this.onSave.bind(this);
  }

  onChange(event) {
    const field = event.target.name;
    const credentials = this.state.credentials;
    credentials[field] = event.target.value;
    return this.setState({credentials: credentials});
  }

  onSave(event) {
    event.preventDefault();
    this.props.actions.logInUser(this.state.credentials);
  }

  render() {
    return (
      <div>
        <form>
          <label>email</label>
          <input 
            type="text"
            name="email"
            value={this.state.credentials.email}
            onChange={this.onChange}/>

          <label>password</label>
          <input
            type="password"
            name="password"
            value={this.state.credentials.password}
            onChange={this.onChange}/>

          <input
            type="submit"
            className="btn btn-primary"
            onClick={this.onSave}/>
        </form>
      </div>
  );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(sessionActions, dispatch)
  };
}
export default connect(null, mapDispatchToProps)(LogInPage);
```

When Redux Promise resolves the Promise in our action creator function, it will pass the action object on to the reducer. Let's build a special reducer, `sessionReducer` to handle the dispatch of the `LOG_IN` action.

We'll define this reducer in `src/reducers/sessionReducer.js` and pull it into our `combineReducers` function:

```js
// src/reducers/index.js

import { combineReducers } from 'redux';
import spaceFormations from './spaceFormationsReducer';
import session from './sessionReducer'

const rootReducer =  combineReducers({
  spaceFormations,
  session
});


export default rootReducer;
```

```js
import {browserHistory} from 'react-router';
export default function sessionReducer(state=false, action) {
  switch ( action.type ) {
    case 'LOG_IN':
      localStorage.setItem('jwt', action.payload)
      browserHistory.push('/')
      return true
    default:
      return state;
  }
}
```

Let's break down what the reducer is doing to respond to this action:

* Store the JWT in the browser's local storage
* Redirect the user to the `/` path, which will bring them to our `IndexRoute` and `SpaceFormationContainer` component
* Return `true`, which will create a new copy of state with the key of `session` set to the value of `true`. This will come in handy later when we need certain components to know whether or not a current user is logged in.

**Note:** The browser's local storage is a simple key/value store available in our browser and therefore *anywhere in our client-side code*. We can add items to this store via `localStorage.setItem('item name', value)` and retreive items via `localStorage.getItem('item name')`. We can remove items via `localStorage.removeItem('item name')`. It's that easy!

Now that we can log in a user and store their JWT, let's update the manner in which our `fetchSpaceFormations` action creator requests data from the API. 

### Step 3: Making Authorized Requests

In order for our request to `http://localhost:3000/api/v1/space_formations` to be authorized, we need to add the proper request header *and include our JWT*. 

Make the following change to your `fetchSpaceFormations` action creator function:

```js
// src/actions/spaceFormationsActions.js

export function fetchSpaceFormations() {
  const spaceFormations = fetch('http://localhost:3000/api/v1/space_formations', {headers: {'Authorization': `Bearer ${localStorage.getItem('jwt')}`}})
    .then(res => {
      return res.json()
    }).then(responseJson => {
      return responseJson
    })
  return {type: 'FETCH_SPACE_FORMATIONS', payload: spaceFormations}
}
```

Now, if we run `npm start`, and vist `http://localhost:8080/login`, fill in the log in form with astronaut Mike Dexter's credentials, we should be succesfully authenticated and redirected to the index route, where we can see all our awesome space pics!

### Step 4: Protecting Routes

Currently if a user is not logged in, they can still visit the index route, which renders `SpaceFormationContainer`. The user would then see a big empty page, since wihtout a JWT, our app can't sucessfully fetch any space formations to display. This is not an ideal user experience. 

If a user is *not* logged in, we should not allow them to see this page. Instead, we should redirect them to the log in page. Let's set this up now. 

We'll implement this feature by taking advantage of React Router's `onEnter` event. Every React Router component responds to an event, `onEnter`, that fires when the app attempts to visit the route. 

We'll define a function to call on the `onEnter` event. Our function will check if someone is logged in. If so, we won't do anything, just allow them to continue to the index route. If they are not logged in, we will redirect to the `/login` path and corresponding `LogInPage` component. 

So, how do we know if someone is logged in? Well, when a user logs in, we store their JWT in local storage. So if a JWT is present in local storage, we have a current user. If not such token is present, we do not. 

Let's do it!

```js
// src/routes.js

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
  if (!(!!localStorage.jwt)) {
    replace({
      pathname: '/login',
      state: { nextPathname: nextState.location.pathname }
    })
  }
}
```

Our `requireAuth` function gets called on the trigger of the `onEnter` event for out `IndexRoute`. React Router will pass two arguments to this function: 

* `nextState` 
* `repalce`

`replace` is a function that we can invoke, giving it an argument of an object that specifies the route to which we want to transition. 

We have an if condition in place that checks to see if there is *not* a JWT present in local storage. If this condition is true, we `replace` the current path with the `/login` path. 

Now, if a user tries to visit `http://localhost:8080` without being logged in, they will be redirect to the log in page. 

### Step 5: The Log Out Feature

Now that we can log in our users, it's time to give them the ability to log out!

Let's think about what we need to do in order to "log out" a user. If a user is considered to be "logged in" based on the presence of a JWT in local storage, then to "log out" a user we need to remove that token from local storage.

Let's build a "log out" link in our nav bar that enacts this change when a user clicks on it. 

#### Displaying the Log Out Link

First, though, we want to make sure that the `log out` link is only visible if you are already logged in. 

Remember that our `sessionReducer` responds to the `LOG_IN` action by creating a new copy of state with a key of `session` set to a value of `true`. This allows any components that are connected to the store, and thus to state, to determine whether or not a user is logged in. 

So, we'll connect our `App` component to the store with the help of `connect` and `mapStateToProps` and then teach it to conditionally display the log out link.

```js
// src/components/App.js

import React, { Component } from 'react';
import {Navbar, Nav, NavItem} from 'react-bootstrap'
import {connect} from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from '../actions/sessionActions.js'

class App extends Component {   

  logOutNavItem() {
    return (
      <NavItem onClick={this.logOut.bind(this)}>log out</NavItem>
    )
  }

  logOut(e) {
    e.preventDefault();
    // do the logging out
  }

  render() {
    return (
      <div className="App">
        <Navbar>
          <Navbar.Header>
            <Navbar.Brand>
              <a href="#">SpaceBook</a>
            </Navbar.Brand>
          </Navbar.Header>
          <Nav>
            {this.props.session ? this.logOutNavItem() : null}
          </Nav>
        </Navbar>
        {this.props.children}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {session: state.session}
}

export default connect(mapStateToProps)(App);
```

We use `mapStateToProps` to give our `App` component a prop of `session`, which will be set to `true` if we went through our authorization flow and `false` if we did not. 

Then, use the ternary operator in our `render` method to display the `NavItem` containing the log out link if `this.props.session` evaluates to `true`. 

On this nav bar item, we added an `onClick` event that calls a function, `logOut`. Here is where we will need to log out our user. However, it is not enought so simply remove their JWT from local storage. Since we set our application state's `session` property to `true` when a user logged in, we need to make sure it gets changed back to `false` when they log out. 

So, we'll define an action to dispatch that will tell the reducer to both remove the token from local storage *and* set state's `session` property to false. 

```js
// src/actions/sessionActions.js

...

export function logUserOut() {
  return {type: 'LOG_OUT'}
}
```

Our `sessionReducer` will respond to it like this:

```js
// src/reducers/sessionReducer.js

import {browserHistory} from 'react-router';
export default function sessionReducer(state=null, action) {
  switch ( action.type ) {
    case 'LOG_IN':
      localStorage.setItem('jwt', action.payload)
      browserHistory.push('/')
      return true
    case 'LOG_OUT':
      localStorage.removeItem('jwt')
      browserHistory.push('/login')
      return false
    default:
      return state;
  }
}
```

The `sessionReducer` removes the token from storage, redirects the user to the log in page and returns `false` so that a new copy of state will be created, with the key of `session` set to false. 

And that's it!

### Putting It All Together

Now, if you are logged out and visit `http://localhost:8080`, you will be redirect to `http://localhost:8080/login`. Fill out the log in form and you will be redirect to the root path and see a list of gorgeous space images. You should see a link in the nav bar to log out. If you click it, you'll be redirect back to the log in page. 

Good job!



















