// sign in
function goSignIn() {
  let email = document.querySelector("#sign-in-email").value;
  let password = document.querySelector("#sign-in-password").value;
  let provider = 'native';
  // let provider = document.querySelector("#sign-in-provider").value;
  console.log("sign in");
  console.log(email, password, provider);

  axios.post("/api/1.0/user/signin",
      {
        email: email,
        password: password,
        provider: provider
      }
    )
    .then(res=> {
      // console.log(res.data);
      console.log(res.data.data);
      // save token to local storage
      window.localStorage.setItem("token", res.data.data.access_token);
    })
    .then(res=> {
      console.log("redirect");
      window.location.href="/index.html";
    })
    .catch(err => {
      console.log(err, err.response);
    });
}

// sign up
function goSignUp() {
  let name = document.querySelector("#sign-up-name").value;
  let email = document.querySelector("#sign-up-email").value;
  let pswd = document.querySelector("#sign-up-password").value;
  let picture = document.querySelector("#sign-up-picture").value;
  // let provider = document.querySelector("#sign-up-provider").value;
  let provider = 'native';

  console.log("sign up");

  // post to /user/signup api
  axios.post("/api/1.0/user/signup",
      { 
        name: name,
        email: email,
        pswd: pswd,
        picture: picture,
        provider: provider
      },
      {
        // headers: {
        //     'Content-Type': 'application/json'
        // }
      }
    )
    .then(res=> {
      console.log("Back to signinup.html");
      console.log(res.data);
      console.log(res.data.data.access_token);
      // // save token to local storage
      window.localStorage.setItem("token", res.data.data.access_token);
    })
    .then(res=> {
    // redirect
      console.log("redirect");
      window.location.href="/profile.html";
    })
    .catch(err => {
      console.log(err, err.response);
    });
}