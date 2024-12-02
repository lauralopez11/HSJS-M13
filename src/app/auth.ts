import authConfig from '@/app/auth.config';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';
import NextAuth from 'next-auth';

const database = new PrismaClient();

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(database),
  session: { strategy: 'jwt' },
  ...authConfig,
});
