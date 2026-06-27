import { prisma } from './src/lib/prisma'

async function addCoins() {
  const email = 'test2@buzzinvitly.com'

  // Get user by email
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true, coinBalance: true }
  })

  if (!user) {
    console.log('User not found:', email)
    return
  }

  console.log('Current user:', user)

  // Add 100 coins
  const updated = await prisma.user.update({
    where: { id: user.id },
    data: {
      coinBalance: {
        increment: 100
      }
    },
    select: { id: true, email: true, coinBalance: true }
  })

  console.log('Updated user:', updated)
  console.log('✅ Added 100 coins!')
}

addCoins()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
