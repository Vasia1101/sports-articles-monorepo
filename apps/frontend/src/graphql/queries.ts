import { gql } from "@apollo/client";

export const ARTICLES = gql`
  query Articles($offset: Int!, $limit: Int!) {
    articles(offset: $offset, limit: $limit) {
      id
      title
      createdAt
    }
  }
`;

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