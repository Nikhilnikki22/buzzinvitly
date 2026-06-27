import { prisma } from './src/lib/prisma'

async function main() {
  const templates = await prisma.template.findMany({
    select: {
      id: true,
      name: true,
      category: true,
      isPremium: true,
      coinCost: true
    }
  })
  
  console.log(`\n📊 Found ${templates.length} templates in database:\n`)
  if (templates.length > 0) {
    templates.forEach(t => {
      const price = t.isPremium ? `${t.coinCost} coins` : 'FREE'
      console.log(`  - ${t.name} (${t.category}) - ${price}`)
    })
  } else {
    console.log('  ❌ No templates found')
  }
}

main().catch(console.error).finally(() => prisma.$disconnect())
