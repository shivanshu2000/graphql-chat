import { gql } from 'apollo-server';

const typeDefs = gql`
  type Query {
    users: [User]
    user: User
  }

  input UserInput {
    email: String!
    firstName: String!
    lastName: String!
    password: String!
  }
  input UserSignin {
    email: String!
    password: String!
  }

  type Token {
    token : String!
  }


  type Mutation {
    signup(user: UserInput!): User
    signin(user: UserSignin!): Token
  }

  type User {
    id: ID!
    email: String!
    firstName: String!
    lastName: String!
    password: String!
  }

`;

export default typeDefs;
