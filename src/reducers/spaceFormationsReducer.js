export default function spaceFormationsReducer(state=[], action) {
  switch ( action.type ) {
    case 'FETCH_SPACE_FORMATIONS':
      return action.payload;
    default:
      return state;
  }
}