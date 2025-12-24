# Sports AI - Analytics & Pick Tracking

A **desktop-first** web application for sports analytics and simulated pick tracking. This is an analytics-only platform with no real betting, deposits, withdrawals, or payment processing.

## 🚀 Tech Stack

- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Prisma** (PostgreSQL)
- **NextAuth.js** (Authentication)
- **Zod** (Schema validation)
- **Vitest** (Unit testing)
- **Playwright** (E2E testing)
- **ESLint + Prettier** (Code quality)

## 📁 Project Structure

```
Sports_AI/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── analytics/         # Analytics page
│   ├── picks/             # Picks tracking page
│   ├── performance/       # Performance page
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Dashboard page
│   └── globals.css        # Global styles
├── components/            # React components
│   └── layout/           # Layout components (Navbar, Sidebar)
├── lib/                   # Utility libraries
│   ├── auth.ts           # NextAuth configuration
│   ├── prisma.ts         # Prisma client
│   ├── utils.ts          # Utility functions
│   └── validations/      # Zod schemas
├── prisma/               # Prisma schema & migrations
│   └── schema.prisma     # Database schema
├── tests/                # Test files
│   ├── e2e/             # Playwright E2E tests
│   └── example.test.ts  # Unit tests
└── public/               # Static assets
```

## 🛠️ Local Development Setup

### Prerequisites

- **Node.js** 18.x or higher
- **PostgreSQL** database (local or hosted)
- **npm** or **pnpm** or **yarn**

### Step 1: Clone and Install

```bash
# Clone the repository
git clone git@github.com:divguptagit/Sports_AI.git
cd Sports_AI

# Install dependencies
npm install
```

### Step 2: Environment Setup

Create a `.env.local` file (already gitignored):

```bash
cp .env.example .env.local
```

Update `.env.local` with your values:

```env
# Database - Update with your PostgreSQL connection string
DATABASE_URL="postgresql://user:password@localhost:5432/sports_ai?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Optional: Add OAuth providers
# GOOGLE_CLIENT_ID=""
# GOOGLE_CLIENT_SECRET=""
```

### Step 3: Database Setup

```bash
# Generate Prisma Client
npm run db:generate

# Push schema to database (for development)
npm run db:push

# OR run migrations (for production-like setup)
npm run db:migrate
```

### Step 4: Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📜 Available Scripts

### Development

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors
npm run format       # Format code with Prettier
npm run format:check # Check formatting
```

### Database

```bash
npm run db:generate  # Generate Prisma Client
npm run db:push      # Push schema to database
npm run db:migrate   # Run migrations
npm run db:studio    # Open Prisma Studio
```

### Testing

```bash
npm run test         # Run Vitest unit tests
npm run test:ui      # Run Vitest with UI
npm run test:e2e     # Run Playwright E2E tests
npm run test:e2e:ui  # Run Playwright with UI
```

## 🎨 Features

### Current Features

- ✅ Desktop-first responsive layout
- ✅ Top navigation bar
- ✅ Left sidebar navigation
- ✅ Dark mode support
- ✅ Dashboard with stats overview
- ✅ NextAuth.js authentication ready
- ✅ Prisma ORM with PostgreSQL
- ✅ Zod schema validation
- ✅ Type-safe TypeScript throughout

### Planned Features

- 📊 Sports analytics and insights
- 📝 Simulated pick tracking
- 📈 Performance metrics and charts
- 📅 Game schedules
- 🎓 Educational content
- 🔔 Notifications

## 🔒 Important Notes

**This is NOT a real betting platform:**
- ❌ No real money betting
- ❌ No deposits or withdrawals
- ❌ No payment processing
- ❌ No sportsbook integration
- ❌ No "how to bet" instructions

**This IS an analytics platform:**
- ✅ Sports analytics and insights
- ✅ Simulated pick tracking
- ✅ Performance metrics
- ✅ Educational content

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run linting and tests
4. Commit with clear messages
5. Push and create a pull request

## 📝 Git Workflow

```bash
# Check status
git status

# Stage all changes
git add -A

# Commit with descriptive message
git commit -m "feat: add new feature"

# Push to GitHub
git push origin main
```

## 🔧 Troubleshooting

### Database Connection Issues

Make sure PostgreSQL is running and the `DATABASE_URL` in `.env.local` is correct.

```bash
# Test database connection
npm run db:studio
```

### NextAuth Issues

Ensure `NEXTAUTH_SECRET` is set in `.env.local`. Generate a secure secret:

```bash
openssl rand -base64 32
```

### Build Errors

Clear Next.js cache and rebuild:

```bash
rm -rf .next
npm run build
```

## 📄 License

Private repository - All rights reserved.

## 👥 Team

Built for desktop-first sports analytics and education.

