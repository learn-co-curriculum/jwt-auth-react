import { combineReducers } from 'redux';
import spaceFormations from './spaceFormationsReducer';
import session from './sessionReducer'

const rootReducer =  combineReducers({
  spaceFormations,
  session
});


export default rootReducer;