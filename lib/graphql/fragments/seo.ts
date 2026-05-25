/**
 * Fragment de SEO via Yoast (extensão WPGraphQL for Yoast SEO).
 * Inclui dados para `<title>`, meta tags, OpenGraph, Twitter Card e schema.
 */
export const SEO_FRAGMENT = /* GraphQL */ `
  fragment SeoFields on PostTypeSEO {
    title
    metaDesc
    canonical
    metaRobotsNoindex
    metaRobotsNofollow
    metaKeywords
    opengraphTitle
    opengraphDescription
    opengraphType
    opengraphUrl
    opengraphSiteName
    opengraphImage {
      sourceUrl
      altText
      mediaDetails {
        width
        height
      }
    }
    twitterTitle
    twitterDescription
    twitterImage {
      sourceUrl
      altText
      mediaDetails {
        width
        height
      }
    }
    schema {
      raw
    }
  }
`;
