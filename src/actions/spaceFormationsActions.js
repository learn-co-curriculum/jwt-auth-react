export function fetchSpaceFormations() {
  const spaceFormations = fetch('http://localhost:3000/api/v1/space_formations', {headers: {'Authorization': `Bearer ${localStorage.getItem('jwt')}`}})
    .then(res => {
      return res.json()
    }).then(responseJson => {
      return responseJson
    })
  return {type: 'FETCH_SPACE_FORMATIONS', payload: spaceFormations}
}