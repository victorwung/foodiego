function goSignIn() {
  let email = document.querySelector('#sign-in-email').value;
  let password = document.querySelector('#sign-in-password').value;
  let provider = 'native';

  axios.post('/api/1.0/user/signin',
      {
        email: email,
        password: password,
        provider: provider
      }
    )
    .then(res=> {
      // save token to local storage
      window.localStorage.setItem('token', res.data.data.access_token);
    })
    .then(res=> {
      // redirect
      window.location.href='/main.html';
    })
    .catch(err => {
      console.log(err, err.response);
    });
}

function goSignUp() {
  let name = document.querySelector('#sign-up-name').value;
  let email = document.querySelector('#sign-up-email').value;
  let password = document.querySelector('#sign-up-password').value;
  let provider = 'native';

  axios.post('/api/1.0/user/signup',
      { 
        name: name,
        email: email,
        password: password,
        provider: provider
      }
    )
    .then(res=> {
      // save token to local storage
      window.localStorage.setItem('token', res.data.data.access_token);
    })
    .then(res=> {
      // redirect
      window.location.href='/main.html';
    })
    .catch(err => {
      console.log(err, err.response);
    });
}