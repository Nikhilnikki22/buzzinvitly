#!/bin/bash

# BuzzInvitly Quick Start Script
# This script sets up your development environment

echo "🚀 BuzzInvitly - Quick Start Setup"
echo "=================================="
echo ""

# Check Node.js version
echo "📦 Checking Node.js version..."
NODE_VERSION=$(node -v)
if [[ $NODE_VERSION < "v20" ]]; then
  echo "❌ Node.js 20+ is required. Current version: $NODE_VERSION"
  echo "Please install Node.js 20+ from https://nodejs.org"
  exit 1
fi
echo "✅ Node.js version: $NODE_VERSION"
echo ""

# Create project
echo "📁 Creating Next.js project..."
npx create-next-app@latest buzzinvitly \
  --typescript \
  --tailwind \
  --app \
  --src-dir \
  --import-alias "@/*" \
  --use-npm

cd buzzinvitly

# Install core dependencies
echo ""
echo "📦 Installing core dependencies..."
npm install \
  @prisma/client \
  next-auth@beta \
  zod \
  react-hook-form \
  @hookform/resolvers \
  date-fns \
  zustand

# Install UI dependencies
echo ""
echo "🎨 Installing UI dependencies..."
npm install \
  @radix-ui/react-dialog \
  @radix-ui/react-dropdown-menu \
  @radix-ui/react-select \
  @radix-ui/react-tabs \
  @radix-ui/react-toast \
  class-variance-authority \
  clsx \
  tailwind-merge \
  lucide-react

# Install dev dependencies
echo ""
echo "🛠️  Installing dev dependencies..."
npm install -D \
  prisma \
  @types/node \
  @types/react \
  @types/react-dom \
  eslint \
  eslint-config-next \
  prettier \
  prettier-plugin-tailwindcss

# Initialize Prisma
echo ""
echo "🗄️  Initializing Prisma..."
npx prisma init

# Create directory structure
echo ""
echo "📂 Creating project structure..."
mkdir -p src/{components,lib,hooks,types,styles}
mkdir -p src/components/{ui,features,layouts}
mkdir -p src/app/{api,auth,dashboard,events,templates}
mkdir -p public/{images,icons}

# Create .env.local
echo ""
echo "⚙️  Creating environment file..."
cat > .env.local << 'EOF'
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/buzzinvitly"
MONGODB_URI="mongodb://localhost:27017/buzzinvitly"
REDIS_URL="redis://localhost:6379"

# Authentication
NEXTAUTH_SECRET="generate-a-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# File Storage (S3 or Cloudflare R2)
AWS_REGION="us-east-1"
AWS_ACCESS_KEY_ID="your-access-key"
AWS_SECRET_ACCESS_KEY="your-secret-key"
AWS_S3_BUCKET="buzzinvitly-dev"

# Email (Resend)
RESEND_API_KEY="your-resend-api-key"
EMAIL_FROM="noreply@buzzinvitly.com"

# SMS (Twilio)
TWILIO_ACCOUNT_SID="your-twilio-sid"
TWILIO_AUTH_TOKEN="your-twilio-token"
TWILIO_PHONE_NUMBER="+1234567890"

# Payments (Stripe)
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# AI (OpenAI)
OPENAI_API_KEY="sk-..."

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="BuzzInvitly"
EOF

# Create basic Prisma schema
echo ""
echo "📋 Creating Prisma schema..."
cat > prisma/schema.prisma << 'EOF'
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String   @id @default(cuid())
  email         String   @unique
  name          String?
  emailVerified DateTime?
  image         String?
  password      String?

  subscription  SubscriptionTier @default(FREE)
  coinBalance   Int              @default(10)

  events        Event[]

  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  @@index([email])
}

enum SubscriptionTier {
  FREE
  PRO
}

model Event {
  id          String      @id @default(cuid())
  hostId      String
  host        User        @relation(fields: [hostId], references: [id])

  title       String
  description String?     @db.Text
  type        EventType

  date        DateTime
  location    String?

  status      EventStatus @default(DRAFT)

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([hostId])
}

enum EventType {
  CARD
  FLYER
}

enum EventStatus {
  DRAFT
  SCHEDULED
  SENT
  ACTIVE
  COMPLETED
}
EOF

# Create lib/prisma.ts
echo ""
echo "🔧 Creating Prisma client..."
mkdir -p src/lib
cat > src/lib/prisma.ts << 'EOF'
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
EOF

# Create README
echo ""
echo "📝 Creating README..."
cat > README.md << 'EOF'
# BuzzInvitly

A modern event invitation platform built with Next.js, TypeScript, and Prisma.

## Features

- 🎨 Beautiful invitation templates (Cards & Flyers)
- ✨ AI-powered design generation
- 📧 Multi-channel delivery (Email, SMS, Link)
- 📊 Advanced analytics & Buzz Score™
- 👥 Comprehensive guest management
- 📱 Mobile-first PWA
- 💳 Flexible monetization (Coins & Subscriptions)

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL
- Redis (optional for development)

### Installation

```bash
# Install dependencies
npm install

# Set up database
npx prisma migrate dev

# Generate Prisma client
npx prisma generate

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Environment Variables

Copy `.env.local` and fill in your credentials:

```bash
cp .env.local .env.local
```

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Database**: PostgreSQL (Prisma), MongoDB (Templates)
- **Auth**: NextAuth.js v5
- **Payments**: Stripe
- **Email**: Resend
- **SMS**: Twilio
- **Storage**: AWS S3

## Project Structure

```
src/
├── app/              # Next.js App Router
├── components/       # React components
│   ├── ui/          # shadcn/ui components
│   ├── features/    # Feature components
│   └── layouts/     # Layout components
├── lib/             # Utility functions
├── hooks/           # Custom React hooks
└── types/           # TypeScript types

prisma/
├── schema.prisma    # Database schema
└── migrations/      # Database migrations

public/
├── images/          # Static images
└── icons/           # Icons and logos
```

## Development

```bash
# Run dev server
npm run dev

# Run Prisma Studio (database GUI)
npx prisma studio

# Run linter
npm run lint

# Run type check
npm run type-check

# Run tests
npm run test
```

## Deployment

Deploy to Vercel:

```bash
vercel
```

## Documentation

See [BUZZINVITLY_COMPLETE_BUILD_SPEC.md](../BUZZINVITLY_COMPLETE_BUILD_SPEC.md) for complete technical specification.

## License

MIT
EOF

# Create package.json scripts
echo ""
echo "📜 Adding useful scripts..."
npm pkg set scripts.dev="next dev"
npm pkg set scripts.build="prisma generate && next build"
npm pkg set scripts.start="next start"
npm pkg set scripts.lint="next lint"
npm pkg set scripts.type-check="tsc --noEmit"
npm pkg set scripts.db:push="prisma db push"
npm pkg set scripts.db:migrate="prisma migrate dev"
npm pkg set scripts.db:studio="prisma studio"
npm pkg set scripts.db:seed="prisma db seed"

# Initialize git
echo ""
echo "📦 Initializing git..."
git init
cat > .gitignore << 'EOF'
# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local
.env

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts

# prisma
/prisma/migrations/
EOF

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. cd buzzinvitly"
echo "2. Update .env.local with your credentials"
echo "3. Set up PostgreSQL database"
echo "4. Run: npx prisma migrate dev"
echo "5. Run: npm run dev"
echo ""
echo "🚀 Happy coding!"
