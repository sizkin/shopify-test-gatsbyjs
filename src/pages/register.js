import React from "react"
import Amplify, { Auth } from 'aws-amplify'

import Layout from "../components/layout"
import SEO from "../components/seo"

import awsconfig from '../../aws-exports';
Amplify.configure(awsconfig);

const handleCreateAccount = async (e) => {
  e.preventDefault();
  const txtEmail = document.querySelector("#txtEmail");
  const txtPwd = document.querySelector("#txtPwd");
  try {
    const { user } = await Auth.signUp({
      username: txtEmail.value,
      password: txtPwd.value
    });
    console.log( user );
    if ( user.hasOwnProperty('userDataKey') ) {
      window.location.href = '/login';
    }
  } catch (err) {
    alert(err.message);
    console.log(err);
  }
}

const RegisterPage = () => (
  <Layout>
    <SEO title="Register" />
    <h1>Register</h1>
    <label>email:</label> <input type="text" id="txtEmail" name="txtEmail" />
    <br />
    <label>password:</label> <input type="password" id="txtPwd" name="txtPwd" />
    <button onClick={handleCreateAccount}>Create Account</button>
  </Layout>
)

export default RegisterPage
