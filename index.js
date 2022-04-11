import { ApolloServer, gql } from 'apollo-server-express';
import jwt from 'jsonwebtoken';
import { ForbiddenError } from 'apollo-server';
import express from 'express';
import typeDefs from './typeDefs.js';
import resolvers from './resolvers.js';
import { createServer } from 'http';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';

import { makeExecutableSchema } from '@graphql-tools/schema';

const app = express();
const httpServer = createServer(app);

const PORT = process.env.PORT || 4000;

const wsServer = new WebSocketServer({
  server: httpServer,
  path: '/graphql',
});
const schema = makeExecutableSchema({ typeDefs, resolvers });

const context = ({ req }) => {
  if (req?.headers) {
    const authorization = req.headers['authorization'];

    console.log('auth is: ', authorization);
    try {
      if (authorization) {
        const token = jwt.verify(authorization, process.env.JWT_SECRET);
        console.log('token is: ', token);
        return { id: token.id };
      }
    } catch (err) {
      // throw new ForbiddenError('jwt expired');
    }
  }
};
const serverCleanup = useServer({ schema, context }, wsServer);

const apolloServer = new ApolloServer({
  schema,
  context,
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          },
        };
      },
    },
  ],
});

await apolloServer.start();
apolloServer.applyMiddleware({ app, path: '/graphql' });

httpServer.listen(4000, () => {
  console.log(' both servers are up');
});
