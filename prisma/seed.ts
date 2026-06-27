import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

console.log('DATABASE_URL:', process.env.DATABASE_URL?.substring(0, 30) + '...')

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

const sampleTemplates = [
  // Birthday Templates
  {
    name: "Modern Birthday Celebration",
    description: "A sleek, contemporary design perfect for milestone birthdays. Features bold typography and vibrant colors.",
    category: "BIRTHDAY",
    thumbnailUrl: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400",
    previewUrl: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800",
    isPremium: false,
    coinCost: 0,
    tags: ["birthday", "modern", "colorful", "celebration"],
    colors: ["#FF6B6B", "#4ECDC4", "#FFE66D"],
  },
  {
    name: "Elegant Birthday Soiree",
    description: "Sophisticated design with gold accents and elegant typography for upscale birthday celebrations.",
    category: "BIRTHDAY",
    thumbnailUrl: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400",
    previewUrl: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800",
    isPremium: true,
    coinCost: 5,
    tags: ["birthday", "elegant", "gold", "luxury", "formal"],
    colors: ["#C9A96E", "#1A1A1A", "#FFFFFF"],
  },
  {
    name: "Kids Birthday Party",
    description: "Fun and playful design with cartoon elements, perfect for children's birthday parties.",
    category: "BIRTHDAY",
    thumbnailUrl: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=400",
    previewUrl: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800",
    isPremium: false,
    coinCost: 0,
    tags: ["birthday", "kids", "children", "fun", "playful", "colorful"],
    colors: ["#FF6B9D", "#C44569", "#FFA07A"],
  },

  // Wedding Templates
  {
    name: "Classic Wedding Invitation",
    description: "Timeless design with elegant script fonts and delicate floral accents.",
    category: "WEDDING",
    thumbnailUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?w=400",
    previewUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800",
    isPremium: true,
    coinCost: 10,
    tags: ["wedding", "elegant", "classic", "floral", "romantic"],
    colors: ["#F8E8EE", "#C9A0B5", "#6B4C5F"],
  },
  {
    name: "Modern Minimalist Wedding",
    description: "Clean, contemporary design with simple lines and sophisticated color palette.",
    category: "WEDDING",
    thumbnailUrl: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400",
    previewUrl: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800",
    isPremium: true,
    coinCost: 10,
    tags: ["wedding", "modern", "minimalist", "clean", "contemporary"],
    colors: ["#2C3E50", "#ECF0F1", "#95A5A6"],
  },
  {
    name: "Rustic Wedding Invitation",
    description: "Warm, rustic design with wooden textures and kraft paper aesthetic.",
    category: "WEDDING",
    thumbnailUrl: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=400",
    previewUrl: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800",
    isPremium: false,
    coinCost: 5,
    tags: ["wedding", "rustic", "vintage", "natural", "outdoor"],
    colors: ["#8B7355", "#D4A574", "#F5F5DC"],
  },

  // Baby Shower Templates
  {
    name: "Sweet Baby Shower",
    description: "Adorable design with soft pastels and cute baby elements.",
    category: "BABY_SHOWER",
    thumbnailUrl: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400",
    previewUrl: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800",
    isPremium: false,
    coinCost: 0,
    tags: ["baby shower", "cute", "pastel", "sweet", "baby"],
    colors: ["#FFB6C1", "#87CEEB", "#FFFACD"],
  },
  {
    name: "Gender Reveal Party",
    description: "Exciting design for gender reveal celebrations with pink and blue accents.",
    category: "BABY_SHOWER",
    thumbnailUrl: "https://images.unsplash.com/photo-1515488764276-beab7607c1e6?w=400",
    previewUrl: "https://images.unsplash.com/photo-1515488764276-beab7607c1e6?w=800",
    isPremium: false,
    coinCost: 3,
    tags: ["baby shower", "gender reveal", "celebration", "fun"],
    colors: ["#FFB6C1", "#89CFF0", "#FFFFFF"],
  },

  // Corporate Templates
  {
    name: "Professional Business Event",
    description: "Clean, professional design perfect for corporate events and conferences.",
    category: "CORPORATE",
    thumbnailUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400",
    previewUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800",
    isPremium: true,
    coinCost: 7,
    tags: ["corporate", "business", "professional", "conference", "formal"],
    colors: ["#1E3A8A", "#FFFFFF", "#64748B"],
  },
  {
    name: "Modern Corporate Mixer",
    description: "Contemporary design for networking events and company celebrations.",
    category: "CORPORATE",
    thumbnailUrl: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=400",
    previewUrl: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800",
    isPremium: false,
    coinCost: 5,
    tags: ["corporate", "networking", "modern", "business", "professional"],
    colors: ["#059669", "#FFFFFF", "#374151"],
  },

  // Holiday Templates
  {
    name: "Festive Holiday Party",
    description: "Cheerful design with seasonal decorations and warm holiday colors.",
    category: "HOLIDAY",
    thumbnailUrl: "https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=400",
    previewUrl: "https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=800",
    isPremium: false,
    coinCost: 0,
    tags: ["holiday", "christmas", "festive", "celebration", "winter"],
    colors: ["#DC2626", "#059669", "#F3F4F6"],
  },
  {
    name: "New Year's Eve Gala",
    description: "Glamorous design for New Year celebrations with gold and black theme.",
    category: "HOLIDAY",
    thumbnailUrl: "https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=400",
    previewUrl: "https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=800",
    isPremium: true,
    coinCost: 8,
    tags: ["holiday", "new year", "gala", "elegant", "celebration"],
    colors: ["#000000", "#FFD700", "#FFFFFF"],
  },

  // Graduation Templates
  {
    name: "Classic Graduation Announcement",
    description: "Traditional design celebrating academic achievements with cap and diploma motifs.",
    category: "GRADUATION",
    thumbnailUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400",
    previewUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800",
    isPremium: false,
    coinCost: 0,
    tags: ["graduation", "achievement", "celebration", "academic", "formal"],
    colors: ["#1E40AF", "#FBBF24", "#FFFFFF"],
  },

  // Anniversary Templates
  {
    name: "Golden Anniversary Celebration",
    description: "Elegant design for milestone anniversaries with metallic gold accents.",
    category: "ANNIVERSARY",
    thumbnailUrl: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400",
    previewUrl: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800",
    isPremium: true,
    coinCost: 8,
    tags: ["anniversary", "elegant", "celebration", "milestone", "gold"],
    colors: ["#FFD700", "#1A1A1A", "#FFFFFF"],
  },

  // Party Templates
  {
    name: "Summer Pool Party",
    description: "Vibrant design perfect for summer celebrations and pool parties.",
    category: "PARTY",
    thumbnailUrl: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=400",
    previewUrl: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=800",
    isPremium: false,
    coinCost: 0,
    tags: ["party", "summer", "pool", "fun", "outdoor", "casual"],
    colors: ["#06B6D4", "#F59E0B", "#EC4899"],
  },
  {
    name: "Cocktail Party Invitation",
    description: "Sophisticated design for evening cocktail parties and social gatherings.",
    category: "PARTY",
    thumbnailUrl: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=400",
    previewUrl: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800",
    isPremium: true,
    coinCost: 6,
    tags: ["party", "cocktail", "elegant", "evening", "social"],
    colors: ["#7C3AED", "#EC4899", "#1F2937"],
  },
]

async function main() {
  console.log('🌱 Starting seed...')

  // Clear existing templates
  await prisma.template.deleteMany()
  console.log('✓ Cleared existing templates')

  // Create templates
  for (const template of sampleTemplates) {
    await prisma.template.create({
      data: template,
    })
  }

  console.log(`✓ Created ${sampleTemplates.length} templates`)
  console.log('🎉 Seed completed!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    await pool.end()
  })
