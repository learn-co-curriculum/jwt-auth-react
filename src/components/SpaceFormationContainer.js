import React, { Component } from 'react';
import SpaceFormationList from './SpaceFormationList'
import {connect} from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from '../actions/spaceFormationsActions.js'

class SpaceFormationContainer extends Component {   
  componentDidMount() {
    if (this.props.spaceFormations.length === 0) {
      this.props.actions.fetchSpaceFormations()
    }
  }
  render() {
    return (
      <div>
        <SpaceFormationList spaceFormations={this.props.spaceFormations} />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {spaceFormations: state.spaceFormations}
}

function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators(actions, dispatch)}
}

export default connect(mapStateToProps, mapDispatchToProps)(SpaceFormationContainer)

