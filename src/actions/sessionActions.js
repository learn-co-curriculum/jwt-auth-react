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