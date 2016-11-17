import {browserHistory} from 'react-router';
export default function sessionReducer(state=null, action) {
  switch ( action.type ) {
    case 'LOG_IN':
      localStorage.setItem('jwt', action.payload)
      browserHistory.push('/')
      return action.payload
    default:
      return state;
  }
}