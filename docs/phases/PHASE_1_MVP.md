# Phase 1: MVP (Weeks 1-8)

**Goal**: Build a functional invitation platform with core features

**Deliverable**: Users can create events, customize invitations, send via email, and receive RSVPs

---

## Week 1-2: Foundation ✅

### Objectives
- Project setup and infrastructure
- Authentication system
- Basic UI shell

### Tasks

#### Day 1: Project Setup
- [ ] Run `buzzinvitly-quickstart.sh`
- [ ] Verify Node.js, PostgreSQL installed
- [ ] Create Supabase project
- [ ] Configure environment variables
- [ ] Initialize Git repository

**Ask Claude:**
```
"Let's set up the BuzzInvitly project from scratch.
I want to:
1. Initialize the Next.js project with TypeScript
2. Set up Prisma with PostgreSQL
3. Configure environment variables
4. Create the basic folder structure"
```

#### Day 2: Database Schema
- [ ] Design initial Prisma schema (User, Event models)
- [ ] Run first migration
- [ ] Test database connection
- [ ] Set up Prisma Studio

**Ask Claude:**
```
"Create the initial Prisma schema with:
- User model (id, email, name, password, subscription, coinBalance)
- Event model (id, hostId, title, type, date, status)
- Proper relationships and indexes"
```

#### Day 3-4: Authentication
- [ ] Install NextAuth.js v5
- [ ] Configure email/password provider
- [ ] Add Google OAuth
- [ ] Create login/signup pages
- [ ] Implement session management

**Ask Claude:**
```
"Set up NextAuth.js v5 with:
- Email/password authentication
- Google OAuth
- TypeScript types
- Session handling
- Protected routes middleware"
```

#### Day 5: User Dashboard
- [ ] Create dashboard layout
- [ ] Build navigation component
- [ ] Add user profile dropdown
- [ ] Implement logout functionality

**Ask Claude:**
```
"Create the user dashboard layout with:
- Top navigation bar with logo and user menu
- Sidebar navigation
- Main content area
- Responsive mobile menu
- User profile dropdown with logout"
```

#### Day 6-7: Email Verification
- [ ] Generate verification tokens
- [ ] Send verification emails
- [ ] Create verification page
- [ ] Add resend verification option

**Ask Claude:**
```
"Implement email verification flow:
- Generate unique tokens on signup
- Send verification email with Resend
- Create verification page that validates token
- Add 'Resend verification' button
- Update user.emailVerified field"
```

#### Day 8: User Profile
- [ ] Create profile page
- [ ] Build edit profile form
- [ ] Add avatar upload
- [ ] Implement password change

**Ask Claude:**
```
"Build the user profile page with:
- Display name, email, avatar
- Edit form with validation (Zod)
- Avatar upload to S3
- Change password functionality
- Save button with loading state"
```

### Testing Checklist
- [ ] User can sign up with email/password
- [ ] User receives verification email
- [ ] User can log in after verification
- [ ] User can log in with Google
- [ ] User can view/edit profile
- [ ] User can upload avatar
- [ ] User can change password
- [ ] User can log out

---

## Week 3-4: Template System ✅

### Objectives
- MongoDB setup for templates
- Template gallery UI
- Template filtering and search

### Tasks

#### Day 9: MongoDB Setup
- [ ] Install MongoDB client
- [ ] Create MongoDB Atlas cluster
- [ ] Define Template schema
- [ ] Create seed script

**Ask Claude:**
```
"Set up MongoDB for templates:
1. Create MongoDB connection utility
2. Define Template interface/schema
3. Create seed script to add 30 templates
4. Add template categories (weddings, birthdays, etc.)"
```

#### Day 10: Template Seed Data
- [ ] Create 15 card templates (JSON)
- [ ] Create 15 flyer templates (JSON)
- [ ] Generate thumbnail images
- [ ] Seed database

**Ask Claude:**
```
"Create seed data for 30 templates:
- 15 card templates (weddings, birthdays, corporate)
- 15 flyer templates (casual, parties, events)
- Each with: name, category, type, isPremium, coinCost, designConfig, thumbnail
- Include customizable fields for each"
```

#### Day 11-12: Template Gallery
- [ ] Create template gallery page
- [ ] Build template card component
- [ ] Add grid layout (responsive)
- [ ] Implement infinite scroll or pagination

**Ask Claude:**
```
"Build the template gallery page:
- Fetch templates from MongoDB
- Display in responsive grid (3 cols desktop, 2 tablet, 1 mobile)
- TemplateCard component showing thumbnail, name, premium badge
- Hover effect with 'Use Template' button
- Loading skeleton
- Empty state"
```

#### Day 13: Template Filtering
- [ ] Add filter sidebar
- [ ] Category filter (checkboxes)
- [ ] Type filter (Card/Flyer toggle)
- [ ] Premium/Free toggle
- [ ] Apply filters to query

**Ask Claude:**
```
"Add template filtering:
- Filter sidebar with categories (Wedding, Birthday, etc.)
- Toggle between Card and Flyer
- Premium/Free filter
- Update URL params for sharing
- Show active filter count
- Clear all filters button"
```

#### Day 14: Template Preview
- [ ] Create preview modal
- [ ] Show full template details
- [ ] Add image carousel
- [ ] Implement "Use Template" action

**Ask Claude:**
```
"Create template preview modal:
- Show large template preview image
- Display template name, description, category
- Show customization options available
- Premium badge and coin cost
- Desktop/mobile preview tabs
- 'Use This Template' CTA button
- Close on ESC key"
```

#### Day 15: Template Search
- [ ] Add search bar
- [ ] Implement search by name/tags
- [ ] Show search results count
- [ ] Clear search button

**Ask Claude:**
```
"Add template search functionality:
- Search bar in header
- Search by template name and tags
- Debounced search (300ms)
- Show '42 results for wedding' message
- Clear search 'X' button
- Highlight search term in results"
```

### Testing Checklist
- [ ] Templates load from MongoDB
- [ ] Gallery displays in responsive grid
- [ ] Filters work correctly
- [ ] Search finds relevant templates
- [ ] Preview modal opens and closes
- [ ] Can navigate to event creation from template

---

## Week 5-6: Design Editor ✅

### Objectives
- Fabric.js canvas integration
- Text editing tools
- Image upload and manipulation
- Preview system

### Tasks

#### Day 16-17: Canvas Setup
- [ ] Install Fabric.js
- [ ] Create DesignEditor component
- [ ] Load template on canvas
- [ ] Implement zoom controls

**Ask Claude:**
```
"Set up Fabric.js design editor:
- Install fabric and @types/fabric
- Create DesignEditor component
- Load template layers onto canvas
- Add zoom controls (fit, 50%, 100%, 200%)
- Implement pan/drag canvas
- Add canvas size indicators"
```

#### Day 18: Text Editing
- [ ] Text selection
- [ ] Font picker (Google Fonts)
- [ ] Font size slider
- [ ] Color picker
- [ ] Bold/Italic/Underline toggles

**Ask Claude:**
```
"Implement text editing tools:
- Select text objects on canvas
- Font picker with Google Fonts preview
- Font size slider (8-200px)
- Color picker with hex input
- Bold, Italic, Underline buttons
- Text alignment (left, center, right)
- Letter spacing and line height controls"
```

#### Day 19: Image Upload
- [ ] Image upload dropzone
- [ ] Image cropping tool
- [ ] Add to canvas
- [ ] Replace placeholder images

**Ask Claude:**
```
"Add image upload functionality:
- Dropzone for drag-and-drop upload
- File type validation (jpg, png, webp)
- Max size 10MB
- Image cropping modal (react-easy-crop)
- Optimize and upload to S3
- Add image to canvas at specified position
- Replace template placeholder images"
```

#### Day 20: Color Customization
- [ ] Custom color picker
- [ ] Predefined palettes
- [ ] Apply to backgrounds
- [ ] Apply to text

**Ask Claude:**
```
"Build color customization system:
- Custom color picker with hex/rgb/hsv
- Show template's default palette
- Create custom palette option
- Apply colors to selected elements
- Apply to backgrounds
- Save custom colors to user preferences"
```

#### Day 21-22: Preview System
- [ ] Export canvas to image
- [ ] Multi-device preview
- [ ] Email preview
- [ ] Send test email

**Ask Claude:**
```
"Create preview system:
- Export canvas to high-res PNG
- Preview modal with tabs (Desktop, Tablet, Mobile, Email)
- Render in different viewport sizes
- 'Send Test Email' button
- Loading states during export
- Download preview as PDF option"
```

### Testing Checklist
- [ ] Canvas loads template correctly
- [ ] Can edit all text fields
- [ ] Font picker works
- [ ] Colors apply correctly
- [ ] Images upload and crop
- [ ] Preview shows accurate design
- [ ] Can send test email
- [ ] Zoom and pan work smoothly

---

## Week 7-8: Event Creation ✅

### Objectives
- Event creation workflow
- Template selection integration
- Draft saving
- Event management

### Tasks

#### Day 23: Event Creation Form
- [ ] Create multi-step form
- [ ] Event details step (title, date, location)
- [ ] Form validation (Zod)
- [ ] Save as draft

**Ask Claude:**
```
"Create event creation form:
- Multi-step wizard (Details → Template → Customize)
- Step 1: Event details
  - Title (required)
  - Date and time picker
  - Location with autocomplete
  - Event type (Card/Flyer)
  - Description (optional)
- Zod validation schema
- Save as draft button
- Progress indicator"
```

#### Day 24: Template Selection Integration
- [ ] Embed template gallery in wizard
- [ ] Filter by selected event type
- [ ] Select template action
- [ ] Navigate to customization

**Ask Claude:**
```
"Integrate template selection:
- Show filtered templates based on event type
- Highlight selected template
- 'Continue with this template' button
- Store selection in form state
- Navigate to customization step
- Allow going back to change template"
```

#### Day 25: Customization Integration
- [ ] Load selected template in editor
- [ ] Pre-fill event details
- [ ] Save customizations
- [ ] Generate preview

**Ask Claude:**
```
"Wire up customization step:
- Load selected template in DesignEditor
- Pre-fill {{eventTitle}}, {{eventDate}}, etc.
- Save customizations to database
- Generate and store preview image
- 'Save & Continue' button
- Show loading state during save"
```

#### Day 26: Draft Management
- [ ] Load draft events
- [ ] Resume editing
- [ ] Delete draft
- [ ] Auto-save functionality

**Ask Claude:**
```
"Implement draft management:
- Auto-save every 30 seconds
- Show 'Saving...' and 'Saved' indicator
- Load drafts on dashboard
- 'Resume editing' button
- Delete draft with confirmation
- Prevent data loss on browser close"
```

#### Day 27: Event List Page
- [ ] Display user's events
- [ ] Filter by status (draft, sent, active)
- [ ] Sort by date
- [ ] Event cards with actions

**Ask Claude:**
```
"Create event list page:
- Fetch user's events from database
- Display in grid/list view
- EventCard component with:
  - Event title and date
  - Preview image
  - Status badge
  - Actions menu (Edit, Duplicate, Delete)
- Filter by status
- Sort by date (newest/oldest)
- Empty state for no events"
```

#### Day 28: Event Actions
- [ ] Edit event
- [ ] Duplicate event
- [ ] Delete event (with confirmation)
- [ ] View event details

**Ask Claude:**
```
"Implement event actions:
- Edit: Navigate to editor with event loaded
- Duplicate: Create copy with '[Copy]' suffix
- Delete: Show confirmation modal, soft delete
- View: Show event dashboard page
- Loading states for all actions
- Success/error toast notifications"
```

### Testing Checklist
- [ ] Can create new event with all details
- [ ] Form validation works correctly
- [ ] Can select and customize template
- [ ] Draft auto-saves every 30 seconds
- [ ] Can resume editing draft
- [ ] Events display on dashboard
- [ ] Can filter and sort events
- [ ] Can edit/duplicate/delete events
- [ ] Confirmation modals prevent accidents

---

## End of Phase 1 Checklist

### Functional Requirements ✅
- [ ] Users can sign up and log in
- [ ] Users can browse 30+ templates
- [ ] Users can filter and search templates
- [ ] Users can select a template
- [ ] Users can customize text and images
- [ ] Users can preview their design
- [ ] Users can create and save events
- [ ] Users can view their events list
- [ ] Users can edit/duplicate/delete events

### Technical Requirements ✅
- [ ] TypeScript throughout
- [ ] Prisma schema with migrations
- [ ] NextAuth.js authentication working
- [ ] MongoDB connected with templates
- [ ] Fabric.js editor functional
- [ ] File upload to S3 working
- [ ] Forms validated with Zod
- [ ] Responsive design (mobile/tablet/desktop)
- [ ] Loading states and error handling
- [ ] Git commits with clear messages

### Code Quality ✅
- [ ] No TypeScript errors
- [ ] ESLint passing
- [ ] Components properly structured
- [ ] API routes have error handling
- [ ] Database queries optimized
- [ ] Comments on complex logic
- [ ] README updated

---

## Demo Script for Phase 1

**Record a demo showing:**

1. **Sign up flow**
   - Register new account
   - Receive verification email
   - Verify email
   - Log in

2. **Template browsing**
   - Browse template gallery
   - Filter by category
   - Search for templates
   - Preview template details

3. **Event creation**
   - Create new event
   - Enter event details
   - Select template
   - Customize design (change text, upload image, change colors)
   - Preview in different formats
   - Save event

4. **Event management**
   - View events list
   - Filter by status
   - Edit existing event
   - Duplicate event
   - Delete event

**Total demo time: ~5 minutes**

---

## Handoff to Phase 2

### What's Working
- Authentication system
- Template gallery
- Design editor
- Event creation and management

### What's Next (Phase 2)
- Guest management (manual entry, CSV import)
- Invitation sending (email delivery)
- RSVP system (public page, form)
- Dashboard analytics

### Technical Debt to Address
- [ ] Add unit tests for critical functions
- [ ] Improve error messages
- [ ] Optimize template loading performance
- [ ] Add database indexes for queries
- [ ] Implement rate limiting on API routes

### Known Issues
- [List any bugs or issues discovered]
- [Performance concerns]
- [UX improvements needed]

---

**Phase 1 Complete! 🎉**

Ready to move to Phase 2? Tell Claude:
```
"Phase 1 is complete! Let's start Phase 2, Week 9.
First task: Guest management with manual entry and CSV import."
```
