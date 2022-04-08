import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type Query {
    users: [User]
    user: User
    getMessages(id: Int!): [Message]
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
    token: String!
  }

  type Mutation {
    signup(user: UserInput!): User
    signin(user: UserSignin!): Token
    createMessage(receiverId: Int!, text: String!): Message
  }

  scalar Date
  type Message {
    id: ID!
    text: String!
    receiverId: Int!
    senderId: Int!
    createdAt: Date
  }

  type User {
    id: ID!
    email: String!
    firstName: String!
    lastName: String!
    password: String!
  }

  type Subscription {
    message: Message
  }
`;

export default typeDefs;
