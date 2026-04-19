import { graphql } from "../__gen__";

export const BlogListQuery = graphql(`
  query BlogList(
    $first: Int = 10
    $after: String
    $language: LanguageCodeFilterEnum!
  ) {
    posts(
      first: $first
      after: $after
      where: {
        orderby: { field: DATE, order: DESC }
        language: $language
      }
    ) {
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
      pageInfo {
        hasNextPage
        endCursor
      }
    }
    categories(first: 100, where: { language: $language }) {
      nodes {
        id
        name
        slug
        count
      }
    }
  }
`);

export const BlogPostBySlugQuery = graphql(`
  query BlogPostBySlug($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      id
      title
      slug
      date
      content
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
      tags {
        nodes {
          id
          name
          slug
        }
      }
      author {
        node {
          name
          avatar {
            url
          }
        }
      }
      translations {
        slug
        language {
          code
          locale
        }
      }
      language {
        code
        locale
      }
    }
  }
`);


export const BlogPostSlugsQuery = graphql(`
  query BlogPostSlugs(
    $language: LanguageCodeFilterEnum!
    $first: Int = 100
    $after: String
  ) {
    posts(
      first: $first
      after: $after
      where: {
        orderby: { field: DATE, order: DESC }
        language: $language
      }
    ) {
      nodes {
        slug
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`);
