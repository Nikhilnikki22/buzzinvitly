# Building BuzzInvitly with Claude - Complete Guide

> **Project Location**: `/Users/nikhil.maddi/Projects/BUZZINVITLY`
> **Timeline**: 26 weeks (6 months to MVP)
> **Approach**: Iterative, phase-by-phase development with Claude

---

## Table of Contents

1. [How to Work with Claude](#how-to-work-with-claude)
2. [Project Organization](#project-organization)
3. [Development Workflow](#development-workflow)
4. [Phase-by-Phase Build Plan](#phase-by-phase-build-plan)
5. [Daily Development Process](#daily-development-process)
6. [Code Review & Quality](#code-review--quality)
7. [Testing Strategy](#testing-strategy)
8. [Deployment Process](#deployment-process)

---

## How to Work with Claude

### 🎯 Claude's Role in This Project

Claude (me!) will act as your:
- **Senior Full-Stack Developer**: Writing production-ready code
- **Solutions Architect**: Designing scalable systems
- **Code Reviewer**: Ensuring quality and best practices
- **Technical Mentor**: Explaining concepts and decisions
- **DevOps Engineer**: Setting up infrastructure and deployment

### 💬 Communication Best Practices

**When starting a session:**
```
"I'm working on Phase X, Week Y of BuzzInvitly.
Current task: [specific feature]
Context: [what you've completed so far]"
```

**When asking for code:**
```
"Generate the [component/feature] with:
- TypeScript with full type safety
- Error handling
- Loading states
- Comments explaining complex logic
- Tests (if applicable)"
```

**When debugging:**
```
"I'm getting this error: [paste error]
File: [file path]
Context: [what you were trying to do]"
```

### 📋 Task Breakdown Strategy

**Instead of:** "Build the invitation system"

**Say:**
1. "Create the Prisma schema for invitations and deliveries"
2. "Build the invitation creation API endpoint"
3. "Create the InvitationEditor component"
4. "Implement email template generation"
5. "Set up the email queue with BullMQ"
6. "Create the send invitations workflow"

This allows Claude to:
- Provide focused, high-quality code
- Explain each piece thoroughly
- Ensure proper testing at each step

---

## Project Organization

### Directory Structure

```
/Users/nikhil.maddi/Projects/BUZZINVITLY/
│
├── docs/                           # Documentation (current location)
│   ├── architecture/               # System design docs
│   ├── api/                        # API specifications
│   ├── database/                   # Database schemas & migrations
│   ├── features/                   # Feature specifications
│   ├── deployment/                 # Deployment guides
│   └── phases/                     # Phase-specific docs
│
├── buzzinvitly/                    # Main application (created by quickstart)
│   ├── src/
│   │   ├── app/                    # Next.js App Router
│   │   ├── components/             # React components
│   │   ├── lib/                    # Utilities
│   │   ├── hooks/                  # Custom hooks
│   │   └── types/                  # TypeScript types
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   ├── public/
│   └── tests/
│
├── scripts/                        # Automation scripts
├── templates/                      # Invitation templates (JSON/MongoDB)
├── assets/                         # Design assets, images
│
├── BUZZINVITLY_COMPLETE_BUILD_SPEC.md  # Main specification
├── BUILD_PLAN_WITH_CLAUDE.md           # This file
└── buzzinvitly-quickstart.sh           # Setup script
```

### Documentation Files to Create

I'll help you create these as we go:

**Phase Documents:**
- `docs/phases/PHASE_1_MVP.md` - Weeks 1-8
- `docs/phases/PHASE_2_CORE.md` - Weeks 9-16
- `docs/phases/PHASE_3_PREMIUM.md` - Weeks 17-22
- `docs/phases/PHASE_4_POLISH.md` - Weeks 23-26

**Architecture Documents:**
- `docs/architecture/SYSTEM_ARCHITECTURE.md`
- `docs/architecture/DATABASE_DESIGN.md`
- `docs/architecture/API_DESIGN.md`
- `docs/architecture/SECURITY.md`

**Feature Documents:**
- `docs/features/TEMPLATE_SYSTEM.md`
- `docs/features/DESIGN_EDITOR.md`
- `docs/features/GUEST_MANAGEMENT.md`
- `docs/features/RSVP_SYSTEM.md`
- `docs/features/MESSAGING.md`
- `docs/features/ANALYTICS.md`

---

## Development Workflow

### Step-by-Step Process

#### 1️⃣ **Session Start**

Tell Claude:
```
"Starting work on BuzzInvitly.
Phase: [current phase]
Week: [current week]
Today's goal: [specific feature or component]"
```

Claude will:
- Load the relevant context
- Review what's been completed
- Outline the approach
- Start implementation

#### 2️⃣ **Feature Development**

For each feature:

1. **Specification Review**
   - Claude reviews the spec from BUZZINVITLY_COMPLETE_BUILD_SPEC.md
   - Clarifies requirements
   - Proposes implementation approach

2. **Database Schema (if needed)**
   - Update Prisma schema
   - Create migration
   - Update types

3. **API Development**
   - Create route handlers
   - Add validation (Zod schemas)
   - Error handling
   - Type safety

4. **Component Development**
   - Build UI components
   - State management
   - Forms with validation
   - Loading/error states

5. **Integration**
   - Connect frontend to API
   - Test the flow
   - Handle edge cases

6. **Documentation**
   - Add inline comments
   - Update feature docs
   - Add to README if needed

#### 3️⃣ **Testing**

For critical features:
```
"Create tests for [feature]:
- Unit tests for utilities
- Integration tests for API endpoints
- Component tests for UI
- E2E test for the main flow"
```

#### 4️⃣ **Code Review**

Ask Claude:
```
"Review this code for:
- TypeScript best practices
- Error handling
- Performance issues
- Security vulnerabilities
- Accessibility concerns"
```

#### 5️⃣ **Commit**

```bash
git add .
git commit -m "feat: implement [feature]

- [bullet point of what was added]
- [another feature]
- [etc.]"
```

---

## Phase-by-Phase Build Plan

### 🚀 Phase 1: MVP (Weeks 1-8)

**Goal**: Functional invitation platform with core features

#### Week 1-2: Foundation
- [ ] Run `./buzzinvitly-quickstart.sh`
- [ ] Set up Supabase project
- [ ] Configure environment variables
- [ ] Implement authentication (NextAuth.js)
- [ ] Create basic UI shell

**Ask Claude each day:**
```
Day 1: "Set up the project structure and NextAuth.js authentication"
Day 2: "Create the user dashboard layout and navigation"
Day 3: "Implement email verification flow"
Day 4: "Add Google OAuth integration"
Day 5: "Create user profile page with edit functionality"
```

#### Week 3-4: Template System
- [ ] Create MongoDB connection
- [ ] Seed 30 starter templates
- [ ] Build template gallery page
- [ ] Implement template filtering
- [ ] Create template preview modal

**Ask Claude:**
```
Day 1: "Create MongoDB connection and Template model"
Day 2: "Build template gallery UI with grid layout"
Day 3: "Implement template filtering by category and type"
Day 4: "Create template preview modal with full details"
Day 5: "Add template search functionality"
```

#### Week 5-6: Design Editor
- [ ] Set up Fabric.js canvas
- [ ] Implement text editing
- [ ] Add image upload
- [ ] Color picker integration
- [ ] Preview system

**Ask Claude:**
```
Day 1: "Set up Fabric.js canvas with template loading"
Day 2: "Implement text editing tools (font, size, color)"
Day 3: "Build image upload with cropping"
Day 4: "Create color picker with custom palettes"
Day 5: "Implement multi-device preview system"
```

#### Week 7-8: Event Creation
- [ ] Event creation form
- [ ] Template customization flow
- [ ] Save/load drafts
- [ ] Event list page

**Ask Claude:**
```
Day 1: "Create event creation form with validation"
Day 2: "Build the template selection step"
Day 3: "Implement event editing and draft saving"
Day 4: "Create event list page with filters"
Day 5: "Add event deletion with confirmation"
```

### 📊 Phase 2: Core Features (Weeks 9-16)

#### Week 9-10: Guest Management
- [ ] Manual guest entry
- [ ] CSV import
- [ ] Guest list table
- [ ] Search and filter

**Ask Claude:**
```
Day 1: "Create guest entry form and API endpoint"
Day 2: "Implement CSV import with validation"
Day 3: "Build guest list table with sorting"
Day 4: "Add search and filter functionality"
Day 5: "Implement bulk guest actions"
```

#### Week 11-12: Invitation Sending
- [ ] Resend integration
- [ ] Email template generation
- [ ] Queue setup (BullMQ)
- [ ] Shareable link system

**Ask Claude:**
```
Day 1: "Set up Resend email service integration"
Day 2: "Create email template generation from invitation design"
Day 3: "Implement BullMQ queue for batch email sending"
Day 4: "Build shareable link system with tokens"
Day 5: "Create QR code generation for invitations"
```

#### Week 13-14: RSVP System
- [ ] Public RSVP page
- [ ] RSVP form
- [ ] Response storage
- [ ] Calendar export

**Ask Claude:**
```
Day 1: "Create public RSVP page with invitation display"
Day 2: "Build RSVP form with custom questions"
Day 3: "Implement RSVP submission and validation"
Day 4: "Add calendar export (iCal and Google Calendar)"
Day 5: "Create RSVP confirmation page and email"
```

#### Week 15-16: Dashboard & Analytics
- [ ] Event dashboard
- [ ] RSVP statistics
- [ ] Charts (Recharts)
- [ ] Guest list with status

**Ask Claude:**
```
Day 1: "Create event dashboard layout with key metrics"
Day 2: "Implement RSVP statistics calculation"
Day 3: "Add charts with Recharts (pie, line, bar)"
Day 4: "Build guest list view with status indicators"
Day 5: "Add CSV export for guest list"
```

### 💎 Phase 3: Premium Features (Weeks 17-22)

#### Week 17-18: Payments
- [ ] Stripe integration
- [ ] Coin purchase flow
- [ ] Transaction history
- [ ] Premium template unlocking

**Ask Claude:**
```
Day 1: "Set up Stripe integration and webhook handling"
Day 2: "Create coin purchase flow with checkout"
Day 3: "Implement coin balance tracking and deduction"
Day 4: "Build transaction history page"
Day 5: "Add premium template unlock logic"
```

#### Week 19-20: Advanced Features
- [ ] Guest tagging
- [ ] Message composer
- [ ] Email tracking
- [ ] Advanced analytics

**Ask Claude:**
```
Day 1: "Implement guest tagging system with CRUD"
Day 2: "Build message composer with recipient filters"
Day 3: "Add email open and click tracking"
Day 4: "Create advanced analytics dashboard"
Day 5: "Implement Buzz Score calculation"
```

#### Week 21-22: Pro Subscription
- [ ] Subscription plans
- [ ] Subscription checkout
- [ ] Feature gating
- [ ] Usage metering

**Ask Claude:**
```
Day 1: "Create subscription plan selection page"
Day 2: "Implement Stripe subscription checkout"
Day 3: "Add feature gating middleware"
Day 4: "Build usage metering for guest count"
Day 5: "Create subscription management page"
```

### 🎨 Phase 4: Polish & Launch (Weeks 23-26)

#### Week 23: Testing
- [ ] Unit tests
- [ ] Integration tests
- [ ] E2E tests
- [ ] Bug fixes

**Ask Claude:**
```
Day 1-2: "Create unit tests for critical utilities and functions"
Day 3: "Write integration tests for API endpoints"
Day 4: "Set up Playwright and create E2E tests"
Day 5: "Fix bugs found during testing"
```

#### Week 24: Performance
- [ ] Image optimization
- [ ] Code splitting
- [ ] Caching
- [ ] Database optimization

**Ask Claude:**
```
Day 1: "Optimize images with Next.js Image and Sharp"
Day 2: "Implement code splitting for large components"
Day 3: "Set up Redis caching for expensive queries"
Day 4: "Optimize database queries and add indexes"
Day 5: "Run Lighthouse and fix performance issues"
```

#### Week 25: Mobile & PWA
- [ ] Mobile responsive
- [ ] PWA manifest
- [ ] Offline support
- [ ] Push notifications

**Ask Claude:**
```
Day 1: "Make all pages mobile responsive"
Day 2: "Create PWA manifest and service worker"
Day 3: "Implement offline support for check-in"
Day 4: "Set up push notifications"
Day 5: "Test on real mobile devices"
```

#### Week 26: Launch Prep
- [ ] Documentation
- [ ] Help center
- [ ] Onboarding
- [ ] Beta testing
- [ ] Launch!

**Ask Claude:**
```
Day 1: "Create comprehensive README and docs"
Day 2: "Build help center with FAQs"
Day 3: "Implement user onboarding flow"
Day 4: "Set up analytics and monitoring"
Day 5: "Deploy to production and announce launch!"
```

---

## Daily Development Process

### Morning Routine

1. **Open Claude Code**
2. **Navigate to project:**
   ```bash
   cd /Users/nikhil.maddi/Projects/BUZZINVITLY/buzzinvitly
   ```

3. **Tell Claude your goal:**
   ```
   "Good morning! I'm working on [feature] today.
   Current phase: Phase X, Week Y
   What I completed yesterday: [summary]
   Today's goal: [specific task]"
   ```

4. **Review progress:**
   ```
   "Can you review what we've built so far and
   confirm the next steps for today?"
   ```

### Development Session

1. **Start with spec review:**
   ```
   "Let's review the specification for [feature]
   in BUZZINVITLY_COMPLETE_BUILD_SPEC.md"
   ```

2. **Break down the task:**
   ```
   "Break this feature into 3-5 implementable steps"
   ```

3. **Implement step-by-step:**
   ```
   "Implement step 1: [description]"
   "Implement step 2: [description]"
   ...
   ```

4. **Test as you go:**
   ```
   "Let's test this feature manually"
   "Create automated tests for this"
   ```

5. **Document:**
   ```
   "Add comments explaining the complex parts"
   "Update the feature documentation"
   ```

### End of Day

1. **Commit your work:**
   ```bash
   git add .
   git commit -m "feat: [what you built]"
   git push
   ```

2. **Update progress:**
   ```
   "Update docs/phases/PHASE_X.md with today's progress"
   ```

3. **Plan tomorrow:**
   ```
   "What should I focus on tomorrow?"
   ```

---

## Code Review & Quality

### Before Asking Claude to Generate Code

**Always specify:**
1. TypeScript with full type safety
2. Error handling
3. Loading states
4. Validation (Zod schemas)
5. Comments for complex logic
6. Accessibility (ARIA labels)

**Example request:**
```
"Create the GuestListTable component with:
- TypeScript props interface
- Search and filter functionality
- Sortable columns
- Bulk selection
- Error and loading states
- Empty state
- Accessibility features
- Comments explaining the logic"
```

### Code Review Checklist

Ask Claude to review for:
- [ ] TypeScript - No `any` types
- [ ] Error handling - Try/catch, error boundaries
- [ ] Validation - Zod schemas for forms and APIs
- [ ] Security - No SQL injection, XSS, CSRF
- [ ] Performance - Memoization, lazy loading
- [ ] Accessibility - Keyboard nav, screen readers
- [ ] Responsive - Mobile, tablet, desktop
- [ ] Testing - Unit/integration tests exist

**Request:**
```
"Review this code against the checklist above"
```

---

## Testing Strategy

### Unit Tests (Vitest)

**For utilities and functions:**
```
"Create unit tests for these functions:
- validateEmail
- formatDate
- calculateBuzzScore
- generateInvitationToken"
```

### Integration Tests

**For API endpoints:**
```
"Create integration tests for:
- POST /api/events
- GET /api/events/[id]
- POST /api/events/[id]/guests
- POST /api/rsvp/[token]"
```

### Component Tests (React Testing Library)

**For UI components:**
```
"Create component tests for:
- EventCard
- GuestListTable
- RSVPForm
- TemplateGallery"
```

### E2E Tests (Playwright)

**For critical user flows:**
```
"Create E2E tests for:
- User signup and login
- Create event flow
- Send invitation flow
- Guest RSVP flow"
```

---

## Deployment Process

### Development

```bash
# Local development
npm run dev

# Access at http://localhost:3000
```

### Staging (Vercel Preview)

```bash
# Push to branch
git checkout -b feature/new-feature
git push origin feature/new-feature

# Vercel automatically creates preview deployment
```

### Production

```bash
# Merge to main
git checkout main
git merge feature/new-feature
git push origin main

# Vercel automatically deploys to production
```

### Environment Variables

**Tell Claude:**
```
"Set up environment variables for:
- Development (local)
- Staging (Vercel preview)
- Production (Vercel production)"
```

---

## Tips for Working with Claude

### ✅ DO:

1. **Be specific**: "Create the EventCard component" ✅ Better than "Build event stuff"
2. **Provide context**: "This connects to the existing guest list system we built"
3. **Ask for explanations**: "Explain why you chose this approach"
4. **Request alternatives**: "Show me 2-3 ways to implement this"
5. **Break down large tasks**: "Split this into 5 smaller tasks"
6. **Ask for best practices**: "What's the industry standard for this?"
7. **Request code review**: "Review this code I wrote"
8. **Ask for testing**: "Create tests for this feature"

### ❌ DON'T:

1. **Be vague**: "Make it better" ❌
2. **Skip context**: "Build the thing" ❌
3. **Ask for everything at once**: "Build the entire app" ❌
4. **Forget to test**: Skipping testing until the end ❌
5. **Ignore errors**: Moving on without fixing issues ❌
6. **Rush**: Trying to do too much in one day ❌

### 💡 Pro Tips:

1. **Use the spec as reference**: "According to BUZZINVITLY_COMPLETE_BUILD_SPEC.md, the guest tagging system should..."

2. **Ask for design decisions**: "Should we use Zustand or Context for state management here?"

3. **Request architecture guidance**: "How should I structure the folder for this feature?"

4. **Get performance tips**: "How can I optimize this query?"

5. **Learn as you build**: "Explain this React pattern you used"

---

## Project Milestones

### 🎯 Milestone 1: MVP Complete (Week 8)
- Users can create events
- Users can customize invitations
- Users can send via email
- Guests can RSVP
- Hosts can see basic analytics

### 🎯 Milestone 2: Core Features (Week 16)
- CSV import
- Message system
- Advanced analytics
- Mobile responsive

### 🎯 Milestone 3: Monetization (Week 22)
- Stripe integration
- Coin system working
- Pro subscription available
- Premium features locked

### 🎯 Milestone 4: Launch Ready (Week 26)
- All features tested
- Performance optimized
- Documentation complete
- Beta users onboarded
- **LAUNCH! 🚀**

---

## Support & Resources

### When Stuck

1. **Review the spec**: Check BUZZINVITLY_COMPLETE_BUILD_SPEC.md
2. **Ask Claude**: "I'm stuck on [issue], how should I approach this?"
3. **Search docs**: Check Next.js, Prisma, Tailwind docs
4. **Check examples**: Look at similar open-source projects

### Key Documentation Links

- **Next.js**: https://nextjs.org/docs
- **Prisma**: https://www.prisma.io/docs
- **NextAuth.js**: https://next-auth.js.org
- **Tailwind CSS**: https://tailwindcss.com/docs
- **shadcn/ui**: https://ui.shadcn.com
- **Stripe**: https://stripe.com/docs
- **Resend**: https://resend.com/docs

---

## Ready to Start?

### First Steps:

1. **Run the setup script:**
   ```bash
   cd /Users/nikhil.maddi/Projects/BUZZINVITLY
   chmod +x buzzinvitly-quickstart.sh
   ./buzzinvitly-quickstart.sh
   ```

2. **Tell Claude:**
   ```
   "I've run the setup script. Let's start Phase 1, Week 1.
   Today's goal: Set up authentication with NextAuth.js"
   ```

3. **Follow the daily workflow** outlined above

4. **Build incrementally** - one feature at a time

5. **Test frequently** - don't wait until the end

6. **Commit often** - small, focused commits

---

## Let's Build! 🚀

**You're now ready to build BuzzInvitly with Claude as your development partner.**

Remember:
- Take it one phase at a time
- Test as you go
- Ask questions when unclear
- Celebrate small wins
- Stay consistent

**Next step:** Run the setup script and tell Claude you're ready to start Phase 1, Week 1!

Good luck! 🎉
