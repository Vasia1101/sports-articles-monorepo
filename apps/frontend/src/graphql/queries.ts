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
