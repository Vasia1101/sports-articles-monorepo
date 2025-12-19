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
  type ArticlesPage {
    items: [SportsArticle!]!
    totalCount: Int!
  }

  input ArticleInput {
    title: String!
    content: String!
    imageUrl: String
  }

  type Query {
    articles(offset: Int = 0, limit: Int = 10): [SportsArticle!]!
    articlesPage(offset: Int = 0, limit: Int = 10): ArticlesPage!
    article(id: ID!): SportsArticle
  }

  type Mutation {
    createArticle(input: ArticleInput!): SportsArticle!
    updateArticle(id: ID!, input: ArticleInput!): SportsArticle!
    deleteArticle(id: ID!): Boolean!
  }
`;
