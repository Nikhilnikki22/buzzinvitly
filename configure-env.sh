#!/bin/bash

# BuzzInvitly Environment Configuration Script
# Run this to configure your environment variables

echo "🔧 Configuring BuzzInvitly Environment..."
echo ""

# Generated NextAuth secret
NEXTAUTH_SECRET="3yhYQ7Z10IpPanEzUjDBnXMywU2awBT63o0ZWqo+Ojw="

# Update .env.local
cat > .env.local << EOF
# Database (Update with your Supabase URL)
DATABASE_URL="postgresql://postgres:password@localhost:5432/buzzinvitly"
MONGODB_URI="mongodb://localhost:27017/buzzinvitly"
REDIS_URL="redis://localhost:6379"

# Authentication
NEXTAUTH_SECRET="$NEXTAUTH_SECRET"
NEXTAUTH_URL="http://localhost:3001"

# Google OAuth (Optional - add when ready)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# File Storage (AWS S3 or Cloudflare R2)
AWS_REGION="us-east-1"
AWS_ACCESS_KEY_ID=""
AWS_SECRET_ACCESS_KEY=""
AWS_S3_BUCKET="buzzinvitly-dev"

# Email (Resend)
RESEND_API_KEY=""
EMAIL_FROM="noreply@buzzinvitly.com"

# SMS (Twilio)
TWILIO_ACCOUNT_SID=""
TWILIO_AUTH_TOKEN=""
TWILIO_PHONE_NUMBER=""

# Payments (Stripe)
STRIPE_SECRET_KEY=""
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=""
STRIPE_WEBHOOK_SECRET=""

# AI (OpenAI)
OPENAI_API_KEY=""

# App
NEXT_PUBLIC_APP_URL="http://localhost:3001"
NEXT_PUBLIC_APP_NAME="BuzzInvitly"
EOF

echo "✅ Environment configured!"
echo ""
echo "NextAuth Secret: ✅ Generated and configured"
echo "NextAuth URL: http://localhost:3001"
echo ""
echo "⚠️  IMPORTANT: Update DATABASE_URL with your Supabase connection string"
echo ""
echo "To get your Supabase URL:"
echo "1. Go to https://supabase.com"
echo "2. Create a new project (or use existing)"
echo "3. Go to Settings → Database"
echo "4. Copy the 'Connection string' (URI format)"
echo "5. Update DATABASE_URL in .env.local"
echo ""
