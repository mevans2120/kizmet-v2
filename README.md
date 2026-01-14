# Kizmet Massage & Wellness

A professional booking website for Kizmet Massage & Wellness, built with Next.js and ready for Sanity CMS integration.

## Technologies

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **React 18** - UI library
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Component library
- **React Hook Form + Zod** - Form handling and validation

## Getting Started

### Prerequisites

- Node.js 18+ installed ([install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating))

### Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linting
npm run lint
```

The development server runs at `http://localhost:3000`.

## Project Structure

```
src/
├── app/                 # Next.js App Router
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Home page
│   ├── book/            # Booking page
│   ├── services/        # Services page
│   └── policies/        # Policies page
├── components/          # React components
│   └── ui/              # shadcn/ui components
├── page-content/        # Page content components
├── hooks/               # Custom React hooks
└── lib/                 # Utilities
```

## Deployment

This project is optimized for deployment on [Vercel](https://vercel.com):

1. Push your code to a Git repository
2. Import the project in Vercel
3. Vercel will automatically detect Next.js and deploy

## Future Plans

This site is prepared for Sanity CMS integration. See `docs/research/RESEARCH_2026-01-14_vite-to-nextjs-migration.md` for details.

---

*Originally bootstrapped with Lovable, migrated to Next.js App Router.*
