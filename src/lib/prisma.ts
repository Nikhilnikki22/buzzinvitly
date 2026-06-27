import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
  pool: Pool | undefined
}

// Use a working database URL - default to local PostgreSQL if Supabase is down
const databaseUrl = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/buzzinvitly'

// Create pool once and reuse
if (!globalForPrisma.pool) {
  globalForPrisma.pool = new Pool({ connectionString: databaseUrl })
}

const adapter = new PrismaPg(globalForPrisma.pool)

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  adapter,
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
