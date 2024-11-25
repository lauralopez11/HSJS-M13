import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const database = new PrismaClient();

const config = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const { email, password } = credentials;

        const user = await database.user.findUnique({
          where: { email },
        });

        if (!user || !bcrypt.compareSync(password, user.password)) {
          return null;
        }

        return user;
      },
    }),
  ],
};

export default config;
