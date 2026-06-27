# BuzzInvitly Deployment Guide

Complete guide for deploying BuzzInvitly to production.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Database Setup](#database-setup)
4. [Vercel Deployment](#vercel-deployment)
5. [Alternative Deployments](#alternative-deployments)
6. [Post-Deployment](#post-deployment)
7. [Monitoring & Logging](#monitoring--logging)
8. [Troubleshooting](#troubleshooting)

## Prerequisites

### Required Services

- **Vercel Account** (or alternative hosting provider)
- **PostgreSQL Database** (Supabase recommended)
- **Domain Name** (optional but recommended)
- **Email Service** (Resend account)
- **Stripe Account** (for payments)

### Optional Services

- **Twilio Account** (for SMS invitations)
- **AWS S3** (for image uploads)
- **Sentry Account** (for error tracking)
- **Google Analytics** (for analytics)

### Local Requirements

- Node.js 20.x or higher
- npm, pnpm, or yarn
- Git

## Environment Setup

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/buzzinvitly.git
cd buzzinvitly
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env.production` file:

```env
# Database
DATABASE_URL="postgresql://user:pass@host:5432/buzzinvitly?pgbouncer=true&connection_limit=1"

# NextAuth.js
NEXTAUTH_SECRET="your-secret-key-at-least-32-characters-long"
NEXTAUTH_URL="https://buzzinvitly.com"

# Email (Resend)
RESEND_API_KEY="re_xxxxxxxxxxxxx"
RESEND_FROM_EMAIL="noreply@buzzinvitly.com"

# SMS (Twilio) - Optional
TWILIO_ACCOUNT_SID="ACxxxxxxxxxxxxx"
TWILIO_AUTH_TOKEN="xxxxxxxxxxxxx"
TWILIO_PHONE_NUMBER="+1234567890"

# Payments (Stripe)
STRIPE_SECRET_KEY="sk_live_xxxxxxxxxxxxx"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_xxxxxxxxxxxxx"
STRIPE_WEBHOOK_SECRET="whsec_xxxxxxxxxxxxx"

# Storage (AWS S3) - Optional
AWS_ACCESS_KEY_ID="xxxxxxxxxxxxx"
AWS_SECRET_ACCESS_KEY="xxxxxxxxxxxxx"
AWS_REGION="us-east-1"
AWS_S3_BUCKET="buzzinvitly-production"

# Error Tracking (Sentry) - Optional
NEXT_PUBLIC_SENTRY_DSN="https://xxxxx@sentry.io/xxxxx"

# Analytics
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"

# Feature Flags
ENABLE_CACHE="true"
ENABLE_ANALYTICS="true"
NODE_ENV="production"
```

## Database Setup

### Option 1: Supabase (Recommended)

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Click "New Project"
   - Choose a name and password
   - Select region closest to your users

2. **Get Connection String**
   - Go to Settings → Database
   - Copy "Connection string"
   - Replace `[YOUR-PASSWORD]` with your password
   - Add `?pgbouncer=true&connection_limit=1` for serverless

3. **Run Migrations**
   ```bash
   DATABASE_URL="your-connection-string" npx prisma migrate deploy
   ```

4. **Apply Performance Indexes**
   ```bash
   DATABASE_URL="your-connection-string" npm run db:indexes
   ```

5. **Seed Database (Optional)**
   ```bash
   DATABASE_URL="your-connection-string" npm run db:seed
   ```

### Option 2: Self-Hosted PostgreSQL

1. **Install PostgreSQL 14+**
   ```bash
   # Ubuntu/Debian
   sudo apt install postgresql-14

   # macOS
   brew install postgresql@14
   ```

2. **Create Database**
   ```bash
   psql postgres
   ```
   ```sql
   CREATE DATABASE buzzinvitly;
   CREATE USER buzzinvitly_user WITH PASSWORD 'secure_password';
   GRANT ALL PRIVILEGES ON DATABASE buzzinvitly TO buzzinvitly_user;
   \q
   ```

3. **Configure Connection**
   ```env
   DATABASE_URL="postgresql://buzzinvitly_user:secure_password@localhost:5432/buzzinvitly"
   ```

4. **Run Migrations**
   ```bash
   npx prisma migrate deploy
   npm run db:indexes
   ```

## Vercel Deployment

### Quick Deploy (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Follow Prompts**
   - Set up and deploy: Yes
   - Which scope: Your account
   - Link to existing project: No
   - Project name: buzzinvitly
   - Directory: ./
   - Override settings: No

5. **Set Environment Variables**
   ```bash
   vercel env add DATABASE_URL production
   vercel env add NEXTAUTH_SECRET production
   vercel env add NEXTAUTH_URL production
   # ... add all other env vars
   ```

6. **Deploy to Production**
   ```bash
   vercel --prod
   ```

### Deploy via GitHub (Alternative)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your GitHub repository
   - Configure project:
     - Framework Preset: Next.js
     - Root Directory: ./
     - Build Command: `npm run build`
     - Output Directory: .next

3. **Add Environment Variables**
   - Go to Settings → Environment Variables
   - Add all variables from `.env.production`
   - Make sure to select "Production" environment

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Your app is live!

### Custom Domain Setup

1. **Add Domain in Vercel**
   - Go to Settings → Domains
   - Click "Add Domain"
   - Enter your domain (e.g., buzzinvitly.com)

2. **Configure DNS**
   - Add CNAME record:
     ```
     Type: CNAME
     Name: www
     Value: cname.vercel-dns.com
     ```
   - Add A record for apex domain:
     ```
     Type: A
     Name: @
     Value: 76.76.21.21
     ```

3. **SSL Certificate**
   - Vercel automatically provisions SSL
   - Wait 24-48 hours for DNS propagation

4. **Update Environment Variables**
   ```bash
   vercel env rm NEXTAUTH_URL production
   vercel env add NEXTAUTH_URL production
   # Enter: https://buzzinvitly.com
   ```

## Alternative Deployments

### AWS EC2

1. **Launch EC2 Instance**
   - Ubuntu 22.04 LTS
   - t3.medium or larger
   - 20GB SSD storage
   - Configure security group (ports 80, 443, 22)

2. **Connect to Instance**
   ```bash
   ssh -i your-key.pem ubuntu@your-instance-ip
   ```

3. **Install Dependencies**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y

   # Install Node.js 20
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt install -y nodejs

   # Install PostgreSQL
   sudo apt install postgresql postgresql-contrib

   # Install Nginx
   sudo apt install nginx

   # Install PM2
   sudo npm install -g pm2
   ```

4. **Clone and Build**
   ```bash
   git clone https://github.com/yourusername/buzzinvitly.git
   cd buzzinvitly
   npm install
   cp .env.example .env.production
   # Edit .env.production with your values
   npm run build
   ```

5. **Start with PM2**
   ```bash
   pm2 start npm --name "buzzinvitly" -- start
   pm2 save
   pm2 startup
   ```

6. **Configure Nginx**
   ```nginx
   server {
       listen 80;
       server_name buzzinvitly.com www.buzzinvitly.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

7. **SSL with Let's Encrypt**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d buzzinvitly.com -d www.buzzinvitly.com
   ```

### Docker

1. **Create Dockerfile**
   ```dockerfile
   FROM node:20-alpine AS base

   # Dependencies
   FROM base AS deps
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci

   # Builder
   FROM base AS builder
   WORKDIR /app
   COPY --from=deps /app/node_modules ./node_modules
   COPY . .
   RUN npx prisma generate
   RUN npm run build

   # Runner
   FROM base AS runner
   WORKDIR /app
   ENV NODE_ENV production

   RUN addgroup --system --gid 1001 nodejs
   RUN adduser --system --uid 1001 nextjs

   COPY --from=builder /app/public ./public
   COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
   COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

   USER nextjs
   EXPOSE 3000
   ENV PORT 3000

   CMD ["node", "server.js"]
   ```

2. **Create docker-compose.yml**
   ```yaml
   version: '3.8'

   services:
     app:
       build: .
       ports:
         - "3000:3000"
       environment:
         - DATABASE_URL=${DATABASE_URL}
         - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
         - NEXTAUTH_URL=${NEXTAUTH_URL}
       depends_on:
         - db

     db:
       image: postgres:14-alpine
       environment:
         - POSTGRES_USER=buzzinvitly
         - POSTGRES_PASSWORD=secure_password
         - POSTGRES_DB=buzzinvitly
       volumes:
         - postgres_data:/var/lib/postgresql/data
       ports:
         - "5432:5432"

   volumes:
     postgres_data:
   ```

3. **Build and Run**
   ```bash
   docker-compose up -d
   ```

### Digital Ocean App Platform

1. **Create New App**
   - Go to Apps → Create App
   - Connect GitHub repository
   - Select branch: main

2. **Configure Build**
   - Type: Web Service
   - Build Command: `npm run build`
   - Run Command: `npm start`
   - Environment: Node.js 20

3. **Add Environment Variables**
   - Go to Settings → App-Level Environment Variables
   - Add all variables from `.env.production`

4. **Add Database**
   - Go to Database
   - Create PostgreSQL database
   - Copy connection string to `DATABASE_URL`

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment

## Post-Deployment

### 1. Verify Deployment

```bash
# Check health endpoint
curl https://buzzinvitly.com/api/health

# Check authentication
curl https://buzzinvitly.com/api/auth/session
```

### 2. Configure Stripe Webhooks

1. Go to Stripe Dashboard → Webhooks
2. Click "Add endpoint"
3. Enter URL: `https://buzzinvitly.com/api/webhooks/stripe`
4. Select events:
   - `payment_intent.succeeded`
   - `payment_intent.failed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Copy webhook secret to `STRIPE_WEBHOOK_SECRET`

### 3. Configure Email Domain

1. **Resend Setup**
   - Go to Resend Dashboard → Domains
   - Click "Add Domain"
   - Enter your domain: `buzzinvitly.com`
   - Add DNS records:
     ```
     Type: TXT
     Name: _resend
     Value: [provided by Resend]

     Type: CNAME
     Name: resend._domainkey
     Value: [provided by Resend]
     ```
   - Verify domain

### 4. Test Critical Flows

- User registration
- User login
- Event creation
- Invitation sending
- RSVP submission
- Payment processing
- Subscription upgrade

### 5. Performance Optimization

```bash
# Run Lighthouse audit
npx @lhci/cli@latest autorun --config=lighthouserc.json

# Check bundle size
npm run perf:analyze

# Test page speed
curl -o /dev/null -s -w "Time: %{time_total}s\n" https://buzzinvitly.com
```

## Monitoring & Logging

### Sentry Error Tracking

1. **Create Sentry Project**
   - Go to sentry.io
   - Create new project
   - Select Next.js
   - Copy DSN

2. **Install Sentry**
   ```bash
   npm install @sentry/nextjs
   ```

3. **Configure Sentry**
   ```bash
   npx @sentry/wizard@latest -i nextjs
   ```

4. **Add to Environment**
   ```env
   NEXT_PUBLIC_SENTRY_DSN="https://xxxxx@sentry.io/xxxxx"
   ```

### Vercel Analytics

1. **Enable Analytics**
   - Go to Vercel Dashboard → Analytics
   - Click "Enable Analytics"

2. **View Metrics**
   - Real User Monitoring (RUM)
   - Core Web Vitals
   - Page performance
   - API response times

### Database Monitoring

**Supabase Dashboard**:
- Database health
- Connection pool usage
- Query performance
- Slow queries

**Self-Hosted**:
```bash
# Install pg_stat_statements
psql -U postgres -d buzzinvitly
CREATE EXTENSION pg_stat_statements;

# View slow queries
SELECT query, mean_exec_time, calls
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;
```

### Uptime Monitoring

**Options**:
- UptimeRobot (free)
- Pingdom
- StatusCake
- Better Uptime

**Monitor**:
- Homepage: `https://buzzinvitly.com`
- Health endpoint: `https://buzzinvitly.com/api/health`
- API: `https://buzzinvitly.com/api/events`

## Troubleshooting

### Build Fails

**Error**: `Module not found`
```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
npm run build
```

**Error**: `Prisma Client not generated`
```bash
npx prisma generate
npm run build
```

### Database Connection Issues

**Error**: `Can't reach database server`
```bash
# Check connection string
echo $DATABASE_URL

# Test connection
psql $DATABASE_URL

# Check if migrations are applied
npx prisma migrate status
```

**Error**: `Too many connections`
- Enable connection pooling (PgBouncer)
- Add `?pgbouncer=true&connection_limit=1` to DATABASE_URL
- Use Supabase connection pooler

### Email Not Sending

**Check**:
- Resend API key is valid
- Domain is verified
- From email is configured
- Check Resend logs

**Test Email**:
```bash
curl -X POST https://api.resend.com/emails \
  -H "Authorization: Bearer re_xxxxx" \
  -H "Content-Type: application/json" \
  -d '{
    "from": "noreply@buzzinvitly.com",
    "to": "test@example.com",
    "subject": "Test Email",
    "html": "<p>Test</p>"
  }'
```

### Payment Issues

**Stripe Webhooks Not Working**:
- Check webhook URL is correct
- Verify webhook secret matches
- Check Stripe webhook logs
- Ensure endpoint is publicly accessible

**Test Mode vs Live Mode**:
- Use test keys for testing
- Use live keys for production
- Don't mix test and live keys

### Performance Issues

**Slow Page Loads**:
```bash
# Check bundle size
npm run perf:analyze

# Enable caching
ENABLE_CACHE=true

# Apply database indexes
npm run db:indexes
```

**High Database Load**:
- Enable caching layer
- Optimize queries
- Add indexes
- Use connection pooling

### SSL Certificate Issues

**Error**: `Certificate expired`
```bash
# Renew Let's Encrypt certificate
sudo certbot renew
```

**Vercel**:
- Certificates renew automatically
- Check domain configuration
- Verify DNS records

## Rollback

If deployment fails:

**Vercel**:
```bash
# List deployments
vercel ls

# Rollback to previous
vercel rollback [deployment-url]
```

**Manual**:
```bash
# Revert to previous commit
git revert HEAD
git push origin main

# Or checkout previous version
git checkout [previous-commit]
git push -f origin main
```

## Scaling

### Horizontal Scaling

**Vercel**: Scales automatically
**AWS**: Add more EC2 instances + Load Balancer
**Docker**: Use Kubernetes or Docker Swarm

### Database Scaling

**Read Replicas**:
- Add read replicas for read-heavy workloads
- Route read queries to replicas
- Keep writes on primary

**Connection Pooling**:
- Use PgBouncer
- Configure in DATABASE_URL: `?pgbouncer=true`

**Caching**:
- Enable Redis for caching
- Cache frequently accessed data
- Set appropriate TTLs

## Backup & Recovery

### Database Backups

**Supabase**:
- Automatic daily backups
- Point-in-time recovery
- Download backups from dashboard

**Self-Hosted**:
```bash
# Backup
pg_dump -U buzzinvitly_user buzzinvitly > backup.sql

# Restore
psql -U buzzinvitly_user buzzinvitly < backup.sql

# Automated backups (cron)
0 2 * * * pg_dump -U buzzinvitly_user buzzinvitly > /backups/backup-$(date +\%Y\%m\%d).sql
```

### File Backups

**S3 Uploads**:
- S3 versioning enabled
- Lifecycle policies for old versions
- Cross-region replication

---

**Need Help?**

- Email: support@buzzinvitly.com
- Docs: docs.buzzinvitly.com
- Status: status.buzzinvitly.com
