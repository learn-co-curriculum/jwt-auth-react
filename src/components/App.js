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
    this.props.actions.logOut();
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

function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators(actions, dispatch)}
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
