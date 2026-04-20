import { graphql } from "../__gen__";

/**
 * Fragment for author card information
 * Used by: AuthorCard component
 */
export const AuthorCardFragment = graphql(`
  fragment AuthorCard on User {
    id
    databaseId
    name
    slug
    email
    description
    avatar {
      url
    }
  }
`);

/**
 * Fragment for post card in author page
 * Used by: AuthorPostCard component
 */
export const AuthorPostCardFragment = graphql(`
  fragment AuthorPostCard on Post {
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
`);

/**
 * Query to get author by slug with their posts
 * Used by: /blog/autor/[slug] page
 */
export const AuthorBySlugQuery = graphql(`
  query AuthorBySlug($slug: ID!, $first: Int = 100, $language: LanguageCodeFilterEnum!) {
    user(id: $slug, idType: SLUG) {
      ...AuthorCard
      posts(first: $first, where: { orderby: { field: DATE, order: DESC }, language: $language }) {
        nodes {
          ...AuthorPostCard
        }
        pageInfo {
          hasNextPage
          endCursor
        }
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

/**
 * Query to get all author slugs for static paths
 * Used by: getStaticPaths in /blog/autor/[slug]
 */
export const AuthorSlugsQuery = graphql(`
  query AuthorSlugs($first: Int = 100) {
    users(first: $first) {
      nodes {
        slug
      }
    }
  }
`);
