# 🗄️ Database Setup Guide - Quick Start

**Goal**: Get your PostgreSQL database connected and run migrations

**Time**: 5 minutes

---

## Option 1: Supabase (Recommended - Free) ⭐

### Step 1: Create Supabase Account (1 min)
1. Go to https://supabase.com
2. Click "Start your project"
3. Sign up with GitHub (fastest) or email
4. Verify email if needed

### Step 2: Create New Project (2 min)
1. Click "New Project"
2. Fill in:
   - **Name**: `buzzinvitly`
   - **Database Password**: Create strong password (save it!)
   - **Region**: Choose closest to you
   - **Pricing Plan**: Free (includes 500MB database)
3. Click "Create new project"
4. Wait ~2 minutes for provisioning ☕

### Step 3: Get Connection String (1 min)
1. Once project is ready, click "Settings" (gear icon)
2. Click "Database" in sidebar
3. Scroll to "Connection string"
4. Select "URI" tab
5. Copy the connection string
6. Replace `[YOUR-PASSWORD]` with your database password

Example:
```
postgresql://postgres.abcdefghijk:YOUR-PASSWORD-HERE@aws-0-us-east-1.pooler.supabase.com:5432/postgres
```

### Step 4: Update Environment (30 sec)
```bash
cd /Users/nikhil.maddi/Projects/BUZZINVITLY

# Edit .env.local
nano .env.local
```

Add your connection string:
```env
DATABASE_URL="postgresql://postgres.xyz:YOUR-PASSWORD@aws-0-us-east-1.pooler.supabase.com:5432/postgres"
```

Save and exit (Ctrl+X, Y, Enter)

### Step 5: Run Migrations (30 sec)
```bash
npx prisma migrate dev --name init
```

You should see:
```
✔ Generated Prisma Client
Your database is now in sync with your schema.
```

### Step 6: Verify (optional)
```bash
npx prisma studio
```

Opens http://localhost:5555 to view your database!

---

## Option 2: Local PostgreSQL (If Installed)

### Prerequisites
- PostgreSQL installed locally
- `psql` command available

### Quick Setup
```bash
# Create database
createdb buzzinvitly

# Update .env.local
echo 'DATABASE_URL="postgresql://postgres:password@localhost:5432/buzzinvitly"' >> .env.local

# Run migrations
npx prisma migrate dev --name init
```

---

## ✅ Verification Checklist

After setup, verify:

- [ ] `DATABASE_URL` in `.env.local` is set
- [ ] `npx prisma migrate dev` ran successfully
- [ ] Can run `npx prisma studio` without errors
- [ ] See 5 tables in Prisma Studio: User, Account, Session, VerificationToken, Event

---

## 🧪 Test Your Setup

```bash
# Start dev server
npm run dev

# Open http://localhost:3001/auth/signup
# Create test account:
# - Name: Test User
# - Email: test@example.com
# - Password: Test1234
```

Should:
- ✅ Create account successfully
- ✅ Auto-login
- ✅ Redirect to dashboard
- ✅ See "Welcome back, Test!" message

---

## 🆘 Troubleshooting

### Error: "Can't reach database server"
**Solution**: Check your `DATABASE_URL` is correct
```bash
# Test connection
npx prisma studio
```

### Error: "Invalid connection string"
**Solutions**:
- Make sure you replaced `[YOUR-PASSWORD]` with actual password
- Remove brackets `[]` around password
- Ensure no spaces in the connection string
- Use single database URL, not separate host/port/user

### Error: "Authentication failed"
**Solutions**:
- Check password in Supabase dashboard
- Reset database password in Supabase Settings → Database
- Update `DATABASE_URL` with new password

### Error: "Schema already exists"
**Solution**: Reset migrations
```bash
npx prisma migrate reset
npx prisma migrate dev --name init
```

### Can't connect to local PostgreSQL
**Solutions**:
- Check PostgreSQL is running: `pg_isready`
- Start PostgreSQL: `brew services start postgresql` (macOS)
- Check port 5432 is not in use
- Verify username/password in connection string

---

## 📊 What Gets Created

After running migrations:

```sql
-- 5 tables total

CREATE TABLE "User" (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  emailVerified TIMESTAMP,
  password TEXT,
  subscription TEXT DEFAULT 'FREE',
  coinBalance INTEGER DEFAULT 10,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);

CREATE TABLE "Account" (
  id TEXT PRIMARY KEY,
  userId TEXT REFERENCES "User"(id),
  provider TEXT,
  providerAccountId TEXT,
  -- OAuth provider data
);

CREATE TABLE "Session" (
  id TEXT PRIMARY KEY,
  sessionToken TEXT UNIQUE,
  userId TEXT REFERENCES "User"(id),
  expires TIMESTAMP
);

CREATE TABLE "VerificationToken" (
  identifier TEXT,
  token TEXT UNIQUE,
  expires TIMESTAMP
);

CREATE TABLE "Event" (
  id TEXT PRIMARY KEY,
  hostId TEXT REFERENCES "User"(id),
  title TEXT,
  type TEXT,
  date TIMESTAMP,
  status TEXT DEFAULT 'DRAFT',
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);
```

---

## ✨ You're Done!

Once you see:
```
✔ Generated Prisma Client
Your database is now in sync with your schema.
```

You're ready to test authentication! 🎉

**Next**: [Read AUTH_SETUP_COMPLETE.md](./AUTH_SETUP_COMPLETE.md) for testing instructions

---

**Quick Commands Reference**:
```bash
# View database
npx prisma studio

# Reset database (careful!)
npx prisma migrate reset

# Generate Prisma client
npx prisma generate

# Create new migration
npx prisma migrate dev --name <name>
```
