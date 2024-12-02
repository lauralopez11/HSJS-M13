import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { NextAuthConfig, User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const database = new PrismaClient();

const config: NextAuthConfig = {
  trustHost: true,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const { email, password } = credentials as {
          email: string;
          password: string;
        };

        const user = await database.user.findUnique({
          where: { email },
        });

        if (!user || !bcrypt.compareSync(password, user.password)) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        } as User;
      },
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      const dbUser = await database.user.findUnique({
        where: { email: session.user.email },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          emailVerified: true,
        },
      });

      // If user is found, return updated session with user data
      if (dbUser) {
        session.user = {
          id: dbUser.id,
          email: dbUser.email,
          name: dbUser.name,
          image: dbUser.image,
          emailVerified: dbUser.emailVerified,
        };
      }

      return session;
    },
  },
};

export default config;
