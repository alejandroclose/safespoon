// src/lib/auth.js
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { getD1, getOne } from '@/db/db';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, context) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        
        try {
          // Get D1 database instance
          const db = getD1(context);
          
          // Find user by email
          const user = await getOne(
            db, 
            `SELECT * FROM users WHERE email = ? LIMIT 1`,
            [credentials.email]
          );
          
          if (!user || !user.password) {
            return null;
          }
          
          // Verify password
          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );
          
          if (!isPasswordValid) {
            return null;
          }
          
          // Return user data for token
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.user_type || 'user',
          };
        } catch (error) {
          console.error('Error during authentication:', error);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  debug: process.env.NODE_ENV === 'development',
};

export const handler = NextAuth(authOptions);