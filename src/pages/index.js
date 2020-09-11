import React, {useState, useEffect} from "react"
import { Link, graphql } from "gatsby"
import axios from "axios"
import Amplify, { Auth } from 'aws-amplify'

import Layout from "../components/layout"
import SEO from "../components/seo"

import awsconfig from '../../aws-exports';
Amplify.configure(awsconfig);

const IndexPage = ({ data }) => {
  const [signedUser, setSignedUser] = useState({});
  const [cart, setCart] = useState({});

  useEffect(() => {
    Auth.currentAuthenticatedUser()
        .then(user => setSignedUser(user))
        .catch(err => console.log(err));
  });

  const handleAddLineItem = (e) => {
    console.log(e.target.dataset.pid);
    console.log(signedUser);
    if ( signedUser.hasOwnProperty('username') ) {
      const itemID = e.target.dataset.pid;
      const handle = e.target.dataset.handle;
      const qtyElm = document.querySelector(`#purchase-qty-${handle}`);
      const { attributes } = signedUser;
      const data = `mutation {
        checkoutCreate(input: {
          email: "${attributes.email}"
          lineItems: [
            {
              quantity: ${qtyElm.value},
              variantId: "${itemID}"
            }
          ]
        }) {
          checkout {
            id
          }
          checkoutUserErrors {
            code
            field
            message
          }
        }
      }`;
      try {
        axios({
          method: 'POST',
          url: `https://ntt-game-testing.myshopify.com/api/2020-07/graphql.json`,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/graphql',
            'X-Shopify-Storefront-Access-Token': '4f1eff62fecd67a238098678b55d6bc5'
          },
          data: data
        })
        .then((res) => {
          if ( res.data.hasOwnProperty('checkoutCreate') ) {
            alert('Added cart');
            setCart({
              checkoutId: res.data.checkoutCreate.checkout.id,
              user: signedUser
            });
          }
        });
      } catch (e) {
        console.log(e);
      }

    } else {
      alert('Invalid Request');
    }
  }

 return (
    <Layout>
      <SEO title="Home" />
      { signedUser.hasOwnProperty('username') === false ?
          <Link to="/register">Register</Link>
            :
          <Link to="/logout">Logout</Link>
      }
      <h1>List Products from shopify</h1>
      <div>
        {data.allProducts.edges.map(({ node }) => (
          <div key={node.shopifyId}>
            <h3>{node.title}</h3>
            <p>{node.description}</p>
            <span>{node.priceRange.minVariantPrice.currencyCode} {node.priceRange.minVariantPrice.amount}</span>
            <br />
            Qty. <input type="number" min="1" max="99" id="purchase-qty-{node.handle}" />
            <br />
            <button id="checkout-{node.handle}" data-handle={node.handle} data-pid={node.variants[0].shopifyId} onClick={handleAddLineItem}>Add cart</button>
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
        variants {
          shopifyId
        }
      }
    }
  }
}
`
