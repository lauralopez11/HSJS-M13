import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const database = new PrismaClient();

const config = {
    providers: [
        CredentialsProvider({
          name: "Credentials",
          credentials: {
            email: { label: "Email", type: "email" },
            password: { label: "Password", type: "password" }
          },
          async authorize(credentials) {
            const { email, password } = credentials;
    
            // Fetch user from Prisma database
            const user = await database.user.findUnique({
              where: { email },
            });
    
            // If no user is found or password is incorrect
            if (!user || !bcrypt.compareSync(password, user.password)) {
              throw new Error('Invalid credentials');
            }
    
            // Return the user object to be stored in session
            return { id: user.id, email: user.email, username: user.username, role: user.role };
          }
        })
      ],
}

export default config;