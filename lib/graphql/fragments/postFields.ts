/**
 * Fragments reaproveitados pelas queries de Post.
 *
 * `POST_LIST_FIELDS_FRAGMENT` é usado em listagens (sem `content`).
 * Para o post individual, faça spread + `content` na query.
 *
 * O nome do field group ACF assumido é `postFields` (graphql_field_name).
 * Se o seu Field Group estiver com outro nome, ajuste aqui e em
 * `types/wordpress.ts`.
 */
export const POST_LIST_FIELDS_FRAGMENT = /* GraphQL */ `
  fragment PostListFields on Post {
    databaseId
    id
    slug
    uri
    title
    excerpt
    date
    modified
    featuredImage {
      node {
        sourceUrl
        altText
        mediaDetails {
          width
          height
        }
      }
    }
    author {
      node {
        databaseId
        name
        slug
        description
        avatar {
          url
        }
      }
    }
    categories(first: 10) {
      nodes {
        databaseId
        name
        slug
        count
        description
      }
    }
    tags(first: 10) {
      nodes {
        databaseId
        name
        slug
      }
    }
    postFields {
      postHighlight
      postThemeColor
      authorBio
      postCTA
    }
  }
`;
