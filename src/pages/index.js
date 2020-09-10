import React, {useState, useEffect} from "react"
import { Link, graphql } from "gatsby"
import axios from "axios"
import Amplify, { Auth } from 'aws-amplify'

import Layout from "../components/layout"
import SEO from "../components/seo"

const IndexPage = ({ data }) => {
  const [signedUser, setSignedUser] = useState({});  

  useEffect(() => {
    Auth.currentAuthenticatedUser()
        .then(user => setSignedUser(user))
        .catch(err => console.log(err));
  });

  const handleAddLineItem = (e) => {
    console.log(e.target.dataset.pid);
    axios.post('https://ntt-game-testing.myshopify.com/api/2020-07/graphql', `{
      mutation checkoutCreate($input: {variantId: ${e.target.dataset.pid}, quantity: 1}) {
        checkoutCreate(input: $input) {
          checkout {
            id
          }
          checkoutUserErrors {
            code
            field
            message
          }
        }
      }
    }`, {
      'headers': {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,HEAD,OPTIONS,POST,PUT',
        'Access-Control-Allow-Headers': 'Authorization, Content-Type, X-SDK-Variant, X-SDK-Variant-Source, X-SDK-Version, X-Shopify-Storefront-Access-Token, shopify-core-canary, Access-Control-Allow-Origin, Access-Control-Allow-Headers',
        'Accept': 'application/json',
        'Content-Type': 'application/graphql',
        'X-Shopify-Storefront-Access-Token': '4f1eff62fecd67a238098678b55d6bc5'
      }
    });
  }

 return (
    <Layout>
      <SEO title="Home" />
      { signedUser.hasOwnProperty('username') === false ? 
          <Link to="/register">Register</Link> : null
      } 
      <h1>List Products from shopify</h1>
      <div>
        {data.allProducts.edges.map(({ node }) => (
          <div key={node.shopifyId}>
            <h3>{node.title}</h3>
            <p>{node.description}</p>
            <span>{node.priceRange.minVariantPrice.currencyCode} {node.priceRange.minVariantPrice.amount}</span>
            <button id="checkout-{node.handle}" data-pid={node.shopifyId} onClick={handleAddLineItem}>Add cart</button>
          </div>
        ))}
      </div>
    </Layout>
  )
}

export default IndexPage

export const query = graphql`
{
  allProducts: allShopifyProduct(sort: { fields: [title] }) {
    edges {
      node {
        shopifyId
        id
        title
        description
        handle
        priceRange {
          maxVariantPrice {
            amount
            currencyCode
          }
          minVariantPrice {
            amount
            currencyCode
          }
        }
      }
    }
  }
}
`
