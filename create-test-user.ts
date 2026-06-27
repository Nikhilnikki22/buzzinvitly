import { PrismaClient } from '@prisma/client'
import { hashPassword } from './src/lib/auth-utils'

const prisma = new PrismaClient()

async function main() {
  // Delete existing user if exists
  await prisma.user.deleteMany({
    where: { email: 'test2@buzzinvitly.com' }
  })

  // Hash the password
  const hashedPassword = await hashPassword('AnotherTest123')

  // Create test user
  const user = await prisma.user.create({
    data: {
      email: 'test2@buzzinvitly.com',
      name: 'Test User',
      password: hashedPassword,
      emailVerified: new Date(), // Verified email
      subscription: 'FREE',
      coinBalance: 100
    }
  })

  console.log('✅ Test user created successfully!')
  console.log('Email:', user.email)
  console.log('Password: AnotherTest123')
  console.log('Coins:', user.coinBalance)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
