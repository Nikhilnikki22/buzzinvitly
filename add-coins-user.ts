import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Update user coins
  const user = await prisma.user.update({
    where: { email: 'test2@buzzinvitly.com' },
    data: { coinBalance: 100 }
  })

  console.log('✅ Coins updated!')
  console.log('Email:', user.email)
  console.log('New Balance:', user.coinBalance, 'coins')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
