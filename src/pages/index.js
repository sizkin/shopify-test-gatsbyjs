import React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"

const IndexPage = ({ data }) => (
  <Layout>
    <SEO title="Home" />
    <h1>List Products from shopify</h1>
    <div>
      {data.allProducts.edges.map(({ node }) => (
        <div key={node.shopifyId}>
          <h3>{node.title}</h3>
          <p>{node.description}</p>
          <span>{node.priceRange.minVariantPrice.currencyCode} {node.priceRange.minVariantPrice.amount}</span>
        </div>
      ))}
    </div>
  </Layout>
)

export default IndexPage

export const query = graphql`
{
  allProducts: allShopifyProduct(sort: { fields: [title] }) {
    edges {
      node {
        shopifyId
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
