import { ApolloServer, AuthenticationError, gql } from 'apollo-server';
import jwt from 'jsonwebtoken';

import typeDefs from './typeDefs.js';
import resolvers from './resolvers.js';

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const { authorization } = req.headers;

    if (authorization) {
      const { id } = jwt.verify(authorization, process.env.JWT_SECRET);
      console.log('ran');
      return { id };
    }
  },
});

server.listen().then(({ url }) => {
  console.log('Server ready at', url);
});
