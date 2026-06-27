import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { prisma } from '@/lib/prisma'
import { comparePasswords } from '@/lib/auth-utils'
import type { User } from '@prisma/client'

// Validate required environment variables
if (!process.env.AUTH_SECRET && !process.env.NEXTAUTH_SECRET) {
  throw new Error('AUTH_SECRET or NEXTAUTH_SECRET must be set')
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  adapter: PrismaAdapter(prisma),

  session: {
    strategy: 'jwt',
  },

  pages: {
    signIn: '/auth/login',
    signOut: '/auth/login',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
    newUser: '/dashboard',
  },

  providers: [
    // Email/Password Authentication
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required')
        }

        // Find user by email
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        })

        if (!user || !user.password) {
          throw new Error('Invalid email or password')
        }

        // Verify password
        const isValid = await comparePasswords(
          credentials.password as string,
          user.password
        )

        if (!isValid) {
          throw new Error('Invalid email or password')
        }

        // Check if email is verified (temporarily disabled for testing)
        // if (!user.emailVerified) {
        //   throw new Error('Please verify your email before logging in')
        // }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          emailVerified: user.emailVerified,
        }
      },
    }),

    // Google OAuth (only enable if credentials are configured)
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            allowDangerousEmailAccountLinking: true,
          }),
        ]
      : []),
  ],

  callbacks: {
    async jwt({ token, user, account }) {
      // Initial sign in
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
        token.picture = user.image
      }

      // Add subscription and coin balance to token
      if (token.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email },
          select: {
            id: true,
            subscription: true,
            coinBalance: true,
          },
        })

        if (dbUser) {
          token.id = dbUser.id
          token.subscription = dbUser.subscription
          token.coinBalance = dbUser.coinBalance
        }
      }

      return token
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.email = token.email as string
        session.user.name = token.name as string
        session.user.image = token.picture as string
        // @ts-ignore - extending session type
        session.user.subscription = token.subscription
        // @ts-ignore - extending session type
        session.user.coinBalance = token.coinBalance
      }

      return session
    },

    async signIn({ user, account, profile }) {
      // For OAuth providers, ensure email is verified
      if (account?.provider === 'google') {
        return true // Google emails are pre-verified
      }

      // For credentials provider, allow login (email verification temporarily disabled)
      if (account?.provider === 'credentials') {
        return true
      }

      return true
    },
  },

  events: {
    async signIn({ user, account, profile, isNewUser }) {
      console.log('User signed in:', user.email)
    },
    async signOut({ token, session }) {
      console.log('User signed out')
    },
    async createUser({ user }) {
      console.log('New user created:', user.email)
    },
  },

  debug: process.env.NODE_ENV === 'development',
})
