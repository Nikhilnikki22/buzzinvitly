import { DefaultSession } from 'next-auth'
import { SubscriptionTier } from '@prisma/client'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      subscription: SubscriptionTier
      coinBalance: number
    } & DefaultSession['user']
  }

  interface User {
    subscription?: SubscriptionTier
    coinBalance?: number
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    subscription: SubscriptionTier
    coinBalance: number
  }
}
