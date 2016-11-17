import React, { Component } from 'react';
import {Navbar, Nav, NavItem} from 'react-bootstrap'


class App extends Component {   

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
           
          </Nav>
        </Navbar>
        {this.props.children}
      </div>
    );
  }
}

export default App;