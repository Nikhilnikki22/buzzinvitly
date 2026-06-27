import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const user = await prisma.user.findUnique({
    where: { email: 'test2@buzzinvitly.com' }
  })

  if (user) {
    console.log('✅ User found:')
    console.log('- ID:', user.id)
    console.log('- Email:', user.email)
    console.log('- Name:', user.name)
    console.log('- Email Verified:', user.emailVerified)
    console.log('- Has Password:', !!user.password)
    console.log('- Subscription:', user.subscription)
    console.log('- Coins:', user.coinBalance)
  } else {
    console.log('❌ User not found: test2@buzzinvitly.com')
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
