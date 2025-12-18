import gql from "graphql-tag";

export const typeDefs = gql`
  type SportsArticle {
    id: ID!
    title: String!
    content: String!
    createdAt: String
    deletedAt: String
    imageUrl: String
  }

  input ArticleInput {
    title: String!
    content: String!
    imageUrl: String
  }

  type Query {
    articles(offset: Int = 0, limit: Int = 10): [SportsArticle!]!
    article(id: ID!): SportsArticle
  }

  type Mutation {
    createArticle(input: ArticleInput!): SportsArticle!
    updateArticle(id: ID!, input: ArticleInput!): SportsArticle!
    deleteArticle(id: ID!): Boolean!
  }
`;
