import { graphql } from "../__gen__";

export const HomeQuery = graphql(`
  query Home($language: LanguageCodeFilterEnum!) {
    posts(first: 3, where: { orderby: { field: DATE, order: DESC }, language: $language }) {
      nodes {
        id
        title
        slug
        date
        excerpt
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        categories {
          nodes {
            id
            name
            slug
          }
        }
      }
    }
  }
`);
