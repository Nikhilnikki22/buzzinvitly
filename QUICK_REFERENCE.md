# 🚀 BuzzInvitly - Quick Reference Card

**Keep this open while developing!**

---

## 📍 Current Status

**Phase**: 1 - MVP (Weeks 1-8)
**Week**: [Update daily]
**Today's Goal**: [Update daily]

---

## 💬 How to Ask Claude

### ✅ Good Prompts

```
"Create the EventCard component with:
- TypeScript props interface
- Responsive design
- Loading and error states
- Accessibility features
- Click handler for navigation"
```

```
"Implement the RSVP form API endpoint:
- Validate input with Zod
- Store in database with Prisma
- Send confirmation email
- Handle errors gracefully
- Return typed response"
```

```
"Review this code for:
- TypeScript best practices
- Security vulnerabilities
- Performance issues
- Accessibility
- Error handling"
```

### ❌ Avoid

```
"Build the app" ❌ Too broad
"Make it better" ❌ Too vague
"Fix the bug" ❌ No context
```

---

## 🗂️ Project Locations

```bash
# Main project
cd /Users/nikhil.maddi/Projects/BUZZINVITLY

# Application code
cd /Users/nikhil.maddi/Projects/BUZZINVITLY/buzzinvitly

# Documentation
cd /Users/nikhil.maddi/Projects/BUZZINVITLY/docs
```

---

## 🛠️ Common Commands

### Development
```bash
npm run dev              # Start dev server (localhost:3000)
npm run build            # Build for production
npm run lint             # Check code quality
npm run type-check       # TypeScript validation
```

### Database
```bash
npx prisma migrate dev   # Create and run migration
npx prisma generate      # Generate Prisma client
npx prisma studio        # Open database GUI
npx prisma db push       # Push schema (dev only)
```

### Git
```bash
git status               # Check changes
git add .                # Stage all changes
git commit -m "feat: add feature"  # Commit
git push                 # Push to remote
```

---

## 📋 Daily Workflow

### 1. Morning Setup
```
Open Terminal → cd to project → npm run dev
Open Claude Code
Open browser → localhost:3000
```

### 2. Tell Claude Your Goal
```
"Good morning! Working on BuzzInvitly.
Phase: 1, Week: [X]
Today's goal: [specific feature]
Yesterday: [what you completed]"
```

### 3. Break Down Tasks
```
"Break down [feature] into 3-5 steps"
```

### 4. Implement Step-by-Step
```
"Implement step 1: [description]"
→ Test
"Implement step 2: [description]"
→ Test
...
```

### 5. End of Day
```bash
git add .
git commit -m "feat: [what you built]"
git push
```

Update docs:
```
"Update docs/phases/PHASE_1_MVP.md with today's progress"
```

---

## 🎯 Phase 1 Checklist

### Week 1-2: Foundation ✅
- [ ] Project setup
- [ ] Authentication (NextAuth.js)
- [ ] User dashboard
- [ ] Email verification
- [ ] User profile

### Week 3-4: Templates
- [ ] MongoDB setup
- [ ] Template gallery
- [ ] Filtering
- [ ] Search
- [ ] Preview modal

### Week 5-6: Editor
- [ ] Fabric.js canvas
- [ ] Text editing
- [ ] Image upload
- [ ] Color picker
- [ ] Preview system

### Week 7-8: Events
- [ ] Event form
- [ ] Template integration
- [ ] Customization
- [ ] Draft management
- [ ] Event list

---

## 🔧 Troubleshooting

### TypeScript Errors
```bash
npm run type-check       # See all errors
npx tsc --noEmit        # Detailed output
```

Ask Claude:
```
"I'm getting this TypeScript error:
[paste error]
In file: [file path]
How do I fix it?"
```

### Database Issues
```bash
npx prisma studio        # Check data
npx prisma migrate reset # Reset database (careful!)
```

Ask Claude:
```
"Prisma error: [paste error]
My schema: [paste schema section]
How do I fix this?"
```

### Build Errors
```bash
rm -rf .next            # Clear build cache
npm install             # Reinstall dependencies
npm run build           # Rebuild
```

---

## 📚 Key Documents

| Document | Purpose | When to Use |
|----------|---------|-------------|
| `BUZZINVITLY_COMPLETE_BUILD_SPEC.md` | Full specification | Reference for feature details |
| `BUILD_PLAN_WITH_CLAUDE.md` | Development guide | Daily workflow, tips |
| `docs/phases/PHASE_1_MVP.md` | Current phase plan | Daily tasks, checklist |
| `README.md` | Project overview | Onboarding, setup |

---

## 🎨 Tech Stack Quick Ref

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI**: shadcn/ui
- **State**: Zustand
- **Forms**: React Hook Form + Zod

### Backend
- **API**: Next.js API Routes
- **Database**: PostgreSQL (Prisma)
- **Auth**: NextAuth.js v5
- **Queue**: BullMQ + Redis

### Services
- **Email**: Resend
- **SMS**: Twilio
- **Payments**: Stripe
- **Storage**: AWS S3

---

## 🚨 Important Reminders

### Before Coding
- [ ] Read the spec for this feature
- [ ] Understand the requirements
- [ ] Break into small steps

### While Coding
- [ ] Write TypeScript (no `any`)
- [ ] Add error handling
- [ ] Include loading states
- [ ] Test as you go

### Before Committing
- [ ] Run `npm run lint`
- [ ] Run `npm run type-check`
- [ ] Test manually in browser
- [ ] Review changes with `git diff`

### Code Quality Standards
- ✅ TypeScript with full types
- ✅ Zod validation on forms/APIs
- ✅ Error boundaries
- ✅ Loading states
- ✅ Accessibility (ARIA labels)
- ✅ Mobile responsive
- ✅ Comments on complex logic

---

## 💡 Claude Tips

### Request Code
```
"Create [Component] with:
- Full TypeScript types
- Error and loading states
- Responsive design
- Accessibility
- Comments"
```

### Request Review
```
"Review this code for:
- Best practices
- Security
- Performance
- Accessibility"
```

### Request Tests
```
"Create tests for [Feature]:
- Unit tests
- Integration tests
- Edge cases"
```

### Request Documentation
```
"Add JSDoc comments to this code"
"Update the README with [feature] documentation"
```

---

## 📊 Progress Tracking

### Update Daily

```markdown
## [Date] - Week [X], Day [Y]

**Completed**:
- [x] Task 1
- [x] Task 2

**In Progress**:
- [ ] Task 3

**Blockers**:
- None / [Issue description]

**Tomorrow**:
- Task 4
- Task 5
```

---

## 🎯 Next Steps

**Current Task**: [Update this]

**To continue:**
1. Open project: `cd /Users/nikhil.maddi/Projects/BUZZINVITLY/buzzinvitly`
2. Start dev: `npm run dev`
3. Tell Claude: "Continuing work on [feature]"

---

## 🆘 Getting Unstuck

### Stuck on a Bug?
```
"I'm stuck. Here's what I'm trying to do:
[description]

Here's the error:
[paste error]

Here's the code:
[paste relevant code]

What should I do?"
```

### Unsure of Approach?
```
"I need to implement [feature].
What's the best approach?
Show me 2-3 options with pros/cons."
```

### Need Clarification?
```
"In the spec, it mentions [feature].
Can you explain:
1. How this should work?
2. What data structure to use?
3. What the user flow is?"
```

---

## ⌨️ Keyboard Shortcuts

### VS Code (or your editor)
- `Cmd + P` - Quick file open
- `Cmd + Shift + P` - Command palette
- `Cmd + /` - Toggle comment
- `Cmd + D` - Select next occurrence
- `Option + Up/Down` - Move line

### Browser DevTools
- `Cmd + Option + I` - Open DevTools
- `Cmd + Shift + C` - Inspect element
- `Cmd + R` - Refresh
- `Cmd + Shift + R` - Hard refresh

---

## 📞 Quick Links

- **Localhost**: http://localhost:3000
- **Prisma Studio**: http://localhost:5555 (after `npx prisma studio`)
- **Supabase Dashboard**: https://supabase.com/dashboard
- **Stripe Dashboard**: https://dashboard.stripe.com

---

**Last Updated**: [Date]
**Current Phase**: Phase 1 - MVP
**Days in Project**: [X]

---

## 🎉 Motivation

**You're building something amazing!**

- 🏆 Every commit is progress
- 🚀 Small steps lead to big achievements
- 💪 Stay consistent
- 🎯 Focus on one feature at a time
- ✨ You've got this!

---

**Ready to code?** Tell Claude:
```
"Let's continue building BuzzInvitly!
Current task: [your task]"
```
