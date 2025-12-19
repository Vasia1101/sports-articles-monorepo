import { gql } from "@apollo/client";

export const ARTICLE = gql`
  query Article($id: ID!) {
    article(id: $id) {
      id
      title
      content
      createdAt
      imageUrl
    }
  }
`;

export const ARTICLES_PAGE = gql`
  query ArticlesPage($offset: Int!, $limit: Int!) {
    articlesPage(offset: $offset, limit: $limit) {
      totalCount
      items {
        id
        title
        createdAt
      }
    }
  }
`;
