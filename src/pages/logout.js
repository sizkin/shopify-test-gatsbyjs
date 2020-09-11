import React, { useState, useEffect } from "react"
import Amplify, { Auth } from 'aws-amplify'

import Layout from "../components/layout"
import SEO from "../components/seo"

import awsconfig from '../../aws-exports';
Amplify.configure(awsconfig);

const LogoutPage = () => {
  const [signedUser, setSignedUser] = useState({});

  useEffect(() => {
    try {
      // Option 
      // { global: true } , to sign all login
      Auth.signOut()
          .then(() => {
            setSignedUser({});
            window.location.href = '/';
          });
    } catch (error) {
        console.log('error signing out: ', error);
    }
  });

  return (
    <Layout>
      <SEO title="Logout" />
    </Layout>
  )
}

export default LogoutPage
