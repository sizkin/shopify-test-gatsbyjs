import React, { useState, useEffect } from "react"
import Amplify, { Auth } from 'aws-amplify'

import Layout from "../components/layout"
import SEO from "../components/seo"

import awsconfig from '../../aws-exports';
Amplify.configure(awsconfig);

const LoginPage = () => {
  const [signedUser, setSignedUser] = useState({});

  useEffect(() => {
    Auth.currentAuthenticatedUser()
        .then((user) => {
          if (user.hasOwnProperty('username')) window.location.href = '/';
        })
        .catch(err => console.log(err));
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    const txtEmail = document.querySelector("#txtEmail");
    const txtPwd = document.querySelector("#txtPwd");
    try {
      const user = await Auth.signIn(txtEmail.value, txtPwd.value);
      console.log( user );
      if ( user.hasOwnProperty('username') ) window.location.href = '/';
    } catch (err) {
      alert(err.message);
      console.log(err);
    }
  }

  return (
    <Layout>
      <SEO title="Login" />
      <h1>Login</h1>
      <label>email:</label> <input type="text" id="txtEmail" name="txtEmail" />
      <br />
      <label>password:</label> <input type="password" id="txtPwd" name="txtPwd" />
      <br />
      <button onClick={handleLogin}>Login</button>
    </Layout>
  )
}

export default LoginPage
