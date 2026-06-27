# BuzzInvitly

**Create Events That Buzz** - A modern, full-featured event invitation platform built with Next.js, TypeScript, and Prisma.

[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-7.4-2D3748)](https://www.prisma.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Table of Contents

- [Features](#features)
- [Demo](#demo)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Development](#development)
- [Testing](#testing)
- [Performance](#performance)
- [Deployment](#deployment)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

## Features

### Core Features
- **Beautiful Templates**: 50+ professionally designed invitation templates (Cards & Flyers)
- **Design Editor**: Powerful Fabric.js-based canvas editor with text, images, and customization
- **Multi-Channel Delivery**: Send invitations via Email, SMS, or shareable links
- **RSVP Management**: Track guest responses with attending/not attending/maybe status
- **Advanced Analytics**: Real-time event analytics with Buzz Score algorithm
- **Guest Management**: Import, manage, and track unlimited guests

### Advanced Features
- **PWA Support**: Install as mobile app, offline support, push notifications
- **Mobile-First Design**: Responsive UI optimized for all devices
- **Subscription Tiers**: FREE, PRO ($9.99/mo), and BUSINESS ($29.99/mo) plans
- **Coin System**: Flexible pay-per-use model (1 coin = $0.10)
- **Performance Optimized**: Lighthouse score 90+, code splitting, lazy loading
- **Real-time Updates**: Live RSVP tracking and notifications
- **Export Capabilities**: CSV export for guest lists and analytics

### Monetization
- **FREE Plan**: 5 events/month, 50 guests/event, basic templates
- **PRO Plan**: Unlimited events, 500 guests/event, premium templates, analytics
- **BUSINESS Plan**: Everything + custom branding, API access, priority support
- **Coin Purchases**: $10 (100 coins), $25 (250+25 bonus), $50 (500+75 bonus)

## Demo

**Live Demo**: [https://buzzinvitly.vercel.app](https://buzzinvitly.vercel.app)

**Test Credentials**:
- Email: `demo@buzzinvitly.com`
- Password: `Demo123!`

## Getting Started

### Prerequisites

- **Node.js**: 20.x or higher
- **PostgreSQL**: 14.x or higher (or Supabase account)
- **Package Manager**: npm, pnpm, or yarn
- **Git**: For version control

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/buzzinvitly.git
   cd buzzinvitly
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` with your credentials (see [Environment Variables](#environment-variables))

4. **Set up database**
   ```bash
   # Push schema to database
   npm run db:push

   # Run migrations (production)
   npm run db:migrate

   # Seed database with sample data
   npm run db:seed

   # Apply performance indexes
   npm run db:indexes
   ```

5. **Generate Prisma Client**
   ```bash
   npx prisma generate
   ```

6. **Run development server**
   ```bash
   npm run dev
   ```

7. **Open browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Quick Start with Docker

```bash
docker-compose up -d
npm run dev
```

## Environment Variables

Create a `.env.local` file with the following variables:

### Database
```env
DATABASE_URL="postgresql://user:password@localhost:5432/buzzinvitly"
```

### Authentication (NextAuth.js)
```env
NEXTAUTH_SECRET="your-secret-key-min-32-chars"
NEXTAUTH_URL="http://localhost:3000"
```

### Email (Resend)
```env
RESEND_API_KEY="re_xxxxx"
RESEND_FROM_EMAIL="noreply@buzzinvitly.com"
```

### SMS (Twilio) - Optional
```env
TWILIO_ACCOUNT_SID="ACxxxxx"
TWILIO_AUTH_TOKEN="xxxxx"
TWILIO_PHONE_NUMBER="+1234567890"
```

### Payments (Stripe)
```env
STRIPE_SECRET_KEY="sk_test_xxxxx"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_xxxxx"
STRIPE_WEBHOOK_SECRET="whsec_xxxxx"
```

### Storage (AWS S3) - Optional
```env
AWS_ACCESS_KEY_ID="xxxxx"
AWS_SECRET_ACCESS_KEY="xxxxx"
AWS_REGION="us-east-1"
AWS_S3_BUCKET="buzzinvitly-uploads"
```

### Feature Flags
```env
ENABLE_CACHE="true"
ENABLE_ANALYTICS="true"
NODE_ENV="development"
```

See `.env.example` for complete list with descriptions.

## Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5.9
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4.1
- **Components**: shadcn/ui, Radix UI
- **Canvas**: Fabric.js 5.3
- **Charts**: Recharts 3.8
- **Forms**: React Hook Form + Zod
- **State**: Zustand

### Backend
- **Runtime**: Node.js 20
- **Database**: PostgreSQL 14
- **ORM**: Prisma 7.4
- **Authentication**: NextAuth.js v5
- **Email**: Resend
- **SMS**: Twilio
- **Payments**: Stripe

### DevOps
- **Hosting**: Vercel
- **Database**: Supabase
- **Testing**: Vitest, Playwright
- **CI/CD**: GitHub Actions
- **Monitoring**: Sentry, Vercel Analytics

## Project Structure

```
buzzinvitly/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/               # API routes
│   │   ├── auth/              # Authentication pages
│   │   ├── dashboard/         # Dashboard pages
│   │   ├── templates/         # Template gallery
│   │   ├── my-events/         # Event management
│   │   └── offline/           # PWA offline page
│   ├── components/            # React components
│   │   ├── ui/               # shadcn/ui components
│   │   ├── design-editor/    # Canvas editor components
│   │   ├── analytics/        # Analytics components
│   │   ├── mobile/           # Mobile navigation
│   │   └── providers/        # Context providers
│   ├── lib/                   # Utility functions
│   │   ├── auth.ts           # Auth configuration
│   │   ├── cache.ts          # Caching system
│   │   ├── performance.ts    # Performance monitoring
│   │   ├── email.ts          # Email utilities
│   │   └── stripe.ts         # Stripe integration
│   ├── hooks/                 # Custom React hooks
│   ├── types/                 # TypeScript types
│   └── tests/                 # Unit tests
├── prisma/
│   ├── schema.prisma         # Database schema
│   ├── migrations/           # Database migrations
│   └── seed.ts               # Seed script
├── e2e/                       # Playwright E2E tests
├── public/
│   ├── icons/                # PWA icons
│   ├── manifest.json         # PWA manifest
│   └── sw.js                 # Service worker
├── docs/                      # Documentation
│   ├── USER_GUIDE.md         # User documentation
│   ├── API.md                # API documentation
│   ├── DEPLOYMENT.md         # Deployment guide
│   └── FAQ.md                # Frequently asked questions
├── next.config.mjs           # Next.js configuration
├── tailwind.config.ts        # Tailwind CSS config
├── vitest.config.ts          # Vitest config
├── playwright.config.ts      # Playwright config
└── package.json              # Dependencies
```

## Development

### Running Locally

```bash
# Development server
npm run dev

# Database management
npm run db:push          # Push schema changes
npm run db:migrate       # Run migrations
npm run db:studio        # Open Prisma Studio GUI
npm run db:seed          # Seed database
npm run db:indexes       # Apply performance indexes

# Code quality
npm run lint             # Run ESLint
npm run type-check       # TypeScript checks
npm run format           # Format with Prettier

# Build for production
npm run build
npm run start
```

### Database Management

```bash
# Open Prisma Studio (database GUI)
npx prisma studio

# Reset database (CAUTION: deletes all data)
npx prisma migrate reset

# Generate Prisma Client
npx prisma generate
```

### Code Quality Tools

- **ESLint**: Linting and code style
- **Prettier**: Code formatting
- **TypeScript**: Type checking
- **Husky**: Pre-commit hooks (optional)

## Testing

### Unit Tests (Vitest)

```bash
# Run tests
npm run test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

**Coverage Requirements**:
- Statements: 80%+
- Branches: 75%+
- Functions: 80%+
- Lines: 80%+

### E2E Tests (Playwright)

```bash
# Run E2E tests
npm run test:e2e

# Run with UI
npm run test:e2e:ui

# Debug mode
npm run test:e2e:debug

# Run all tests
npm run test:all
```

### Test Files
- Unit tests: `src/**/*.test.ts`
- E2E tests: `e2e/**/*.spec.ts`

## Performance

### Optimization Features
- **Image Optimization**: Next.js Image with AVIF/WebP formats
- **Code Splitting**: Webpack bundle optimization
- **Database Indexes**: 25+ indexes for fast queries
- **Caching**: In-memory cache with TTL
- **Lazy Loading**: Components loaded on demand
- **PWA**: Service worker with offline support

### Performance Metrics (Lighthouse)
- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 95+

### Performance Commands

```bash
# Analyze bundle size
npm run perf:analyze

# Run Lighthouse audit
npx @lhci/cli@latest autorun
```

## Deployment

### Vercel (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Set environment variables**
   - Go to Vercel Dashboard → Settings → Environment Variables
   - Add all variables from `.env.local`

4. **Configure domains**
   - Add custom domain in Vercel Dashboard

### Manual Deployment

See [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md) for detailed deployment guides for:
- Vercel
- AWS (EC2, ECS, Lambda)
- Digital Ocean
- Self-hosted

## API Documentation

### REST API Endpoints

See [docs/API.md](./docs/API.md) for complete API documentation.

**Base URL**: `https://api.buzzinvitly.com`

**Authentication**: Bearer token (JWT)

**Key Endpoints**:
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/events` - List events
- `POST /api/events` - Create event
- `GET /api/templates` - List templates
- `POST /api/invitations/send` - Send invitations

## Contributing

We welcome contributions! See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'feat: add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Commit Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new template category
fix: resolve RSVP email bug
docs: update API documentation
chore: upgrade dependencies
```

## License

MIT License - see [LICENSE](./LICENSE) file for details.

## Support

- **Documentation**: [docs/](./docs/)
- **Issues**: [GitHub Issues](https://github.com/yourusername/buzzinvitly/issues)
- **Email**: support@buzzinvitly.com
- **Discord**: [Join our community](https://discord.gg/buzzinvitly)

## Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Prisma](https://www.prisma.io/) - Database ORM
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Fabric.js](http://fabricjs.com/) - Canvas library
- [Recharts](https://recharts.org/) - Chart library

---

**Built with ❤️ by the BuzzInvitly Team**
