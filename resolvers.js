import client from '@prisma/client';
import {
  ApolloError,
  AuthenticationError,
  ForbiddenError,
} from 'apollo-server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new client.PrismaClient();

const resolvers = {
  Query: {
    users: async (_, args, { id }) => {
      if (!id) throw new ForbiddenError('Not Authorized');
      return await prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        where: { id: { not: id } },
      });
    },
  },

  Mutation: {
    signup: async (_, { user }) => {
      const exists = await prisma.user.findUnique({
        where: { email: user.email },
      });
      if (exists) throw new AuthenticationError('User already exists!');

      const hashedPassword = await bcrypt.hash(user.password, 10);

      const newUser = await prisma.user.create({
        data: {
          ...user,
          password: hashedPassword,
        },
      });

      return newUser;
    },

    signin: async (_, { user }) => {
      const exists = await prisma.user.findUnique({
        where: { email: user.email },
      });

      if (!exists)
        throw new AuthenticationError('User with this mail is not registered');
      const matched = await bcrypt.compare(user.password, exists.password);

      if (!matched) throw new AuthenticationError('Invalid email or password');

      const token = jwt.sign({ id: exists.id }, process.env.JWT_SECRET, {
        expiresIn: '2d',
      });

      return { token };
    },
  },
};

export default resolvers;
