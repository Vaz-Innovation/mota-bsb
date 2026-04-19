/* eslint-disable */
import * as types from './graphql';



/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  query BlogList(\n    $first: Int = 10\n    $after: String\n    $language: LanguageCodeFilterEnum!\n  ) {\n    posts(\n      first: $first\n      after: $after\n      where: {\n        orderby: { field: DATE, order: DESC }\n        language: $language\n      }\n    ) {\n      nodes {\n        id\n        title\n        slug\n        date\n        excerpt\n        featuredImage {\n          node {\n            sourceUrl\n            altText\n          }\n        }\n        categories {\n          nodes {\n            id\n            name\n            slug\n          }\n        }\n      }\n      pageInfo {\n        hasNextPage\n        endCursor\n      }\n    }\n    categories(first: 100, where: { language: $language }) {\n      nodes {\n        id\n        name\n        slug\n        count\n      }\n    }\n  }\n": typeof types.BlogListDocument,
    "\n  query BlogPostBySlug($slug: ID!) {\n    post(id: $slug, idType: SLUG) {\n      id\n      title\n      slug\n      date\n      content\n      excerpt\n      featuredImage {\n        node {\n          sourceUrl\n          altText\n        }\n      }\n      categories {\n        nodes {\n          id\n          name\n          slug\n        }\n      }\n      tags {\n        nodes {\n          id\n          name\n          slug\n        }\n      }\n      author {\n        node {\n          name\n          avatar {\n            url\n          }\n        }\n      }\n      translations {\n        slug\n        language {\n          code\n          locale\n        }\n      }\n      language {\n        code\n        locale\n      }\n    }\n  }\n": typeof types.BlogPostBySlugDocument,
    "\n  query BlogPostSlugs(\n    $language: LanguageCodeFilterEnum!\n    $first: Int = 100\n    $after: String\n  ) {\n    posts(\n      first: $first\n      after: $after\n      where: {\n        orderby: { field: DATE, order: DESC }\n        language: $language\n      }\n    ) {\n      nodes {\n        slug\n      }\n      pageInfo {\n        hasNextPage\n        endCursor\n      }\n    }\n  }\n": typeof types.BlogPostSlugsDocument,
    "\n  query Home($language: LanguageCodeFilterEnum!) {\n    posts(first: 3, where: { orderby: { field: DATE, order: DESC }, language: $language }) {\n      nodes {\n        id\n        title\n        slug\n        date\n        excerpt\n        featuredImage {\n          node {\n            sourceUrl\n            altText\n          }\n        }\n        categories {\n          nodes {\n            id\n            name\n            slug\n          }\n        }\n      }\n    }\n  }\n": typeof types.HomeDocument,
};
const documents: Documents = {
    "\n  query BlogList(\n    $first: Int = 10\n    $after: String\n    $language: LanguageCodeFilterEnum!\n  ) {\n    posts(\n      first: $first\n      after: $after\n      where: {\n        orderby: { field: DATE, order: DESC }\n        language: $language\n      }\n    ) {\n      nodes {\n        id\n        title\n        slug\n        date\n        excerpt\n        featuredImage {\n          node {\n            sourceUrl\n            altText\n          }\n        }\n        categories {\n          nodes {\n            id\n            name\n            slug\n          }\n        }\n      }\n      pageInfo {\n        hasNextPage\n        endCursor\n      }\n    }\n    categories(first: 100, where: { language: $language }) {\n      nodes {\n        id\n        name\n        slug\n        count\n      }\n    }\n  }\n": types.BlogListDocument,
    "\n  query BlogPostBySlug($slug: ID!) {\n    post(id: $slug, idType: SLUG) {\n      id\n      title\n      slug\n      date\n      content\n      excerpt\n      featuredImage {\n        node {\n          sourceUrl\n          altText\n        }\n      }\n      categories {\n        nodes {\n          id\n          name\n          slug\n        }\n      }\n      tags {\n        nodes {\n          id\n          name\n          slug\n        }\n      }\n      author {\n        node {\n          name\n          avatar {\n            url\n          }\n        }\n      }\n      translations {\n        slug\n        language {\n          code\n          locale\n        }\n      }\n      language {\n        code\n        locale\n      }\n    }\n  }\n": types.BlogPostBySlugDocument,
    "\n  query BlogPostSlugs(\n    $language: LanguageCodeFilterEnum!\n    $first: Int = 100\n    $after: String\n  ) {\n    posts(\n      first: $first\n      after: $after\n      where: {\n        orderby: { field: DATE, order: DESC }\n        language: $language\n      }\n    ) {\n      nodes {\n        slug\n      }\n      pageInfo {\n        hasNextPage\n        endCursor\n      }\n    }\n  }\n": types.BlogPostSlugsDocument,
    "\n  query Home($language: LanguageCodeFilterEnum!) {\n    posts(first: 3, where: { orderby: { field: DATE, order: DESC }, language: $language }) {\n      nodes {\n        id\n        title\n        slug\n        date\n        excerpt\n        featuredImage {\n          node {\n            sourceUrl\n            altText\n          }\n        }\n        categories {\n          nodes {\n            id\n            name\n            slug\n          }\n        }\n      }\n    }\n  }\n": types.HomeDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query BlogList(\n    $first: Int = 10\n    $after: String\n    $language: LanguageCodeFilterEnum!\n  ) {\n    posts(\n      first: $first\n      after: $after\n      where: {\n        orderby: { field: DATE, order: DESC }\n        language: $language\n      }\n    ) {\n      nodes {\n        id\n        title\n        slug\n        date\n        excerpt\n        featuredImage {\n          node {\n            sourceUrl\n            altText\n          }\n        }\n        categories {\n          nodes {\n            id\n            name\n            slug\n          }\n        }\n      }\n      pageInfo {\n        hasNextPage\n        endCursor\n      }\n    }\n    categories(first: 100, where: { language: $language }) {\n      nodes {\n        id\n        name\n        slug\n        count\n      }\n    }\n  }\n"): typeof import('./graphql').BlogListDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query BlogPostBySlug($slug: ID!) {\n    post(id: $slug, idType: SLUG) {\n      id\n      title\n      slug\n      date\n      content\n      excerpt\n      featuredImage {\n        node {\n          sourceUrl\n          altText\n        }\n      }\n      categories {\n        nodes {\n          id\n          name\n          slug\n        }\n      }\n      tags {\n        nodes {\n          id\n          name\n          slug\n        }\n      }\n      author {\n        node {\n          name\n          avatar {\n            url\n          }\n        }\n      }\n      translations {\n        slug\n        language {\n          code\n          locale\n        }\n      }\n      language {\n        code\n        locale\n      }\n    }\n  }\n"): typeof import('./graphql').BlogPostBySlugDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query BlogPostSlugs(\n    $language: LanguageCodeFilterEnum!\n    $first: Int = 100\n    $after: String\n  ) {\n    posts(\n      first: $first\n      after: $after\n      where: {\n        orderby: { field: DATE, order: DESC }\n        language: $language\n      }\n    ) {\n      nodes {\n        slug\n      }\n      pageInfo {\n        hasNextPage\n        endCursor\n      }\n    }\n  }\n"): typeof import('./graphql').BlogPostSlugsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Home($language: LanguageCodeFilterEnum!) {\n    posts(first: 3, where: { orderby: { field: DATE, order: DESC }, language: $language }) {\n      nodes {\n        id\n        title\n        slug\n        date\n        excerpt\n        featuredImage {\n          node {\n            sourceUrl\n            altText\n          }\n        }\n        categories {\n          nodes {\n            id\n            name\n            slug\n          }\n        }\n      }\n    }\n  }\n"): typeof import('./graphql').HomeDocument;


export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}
