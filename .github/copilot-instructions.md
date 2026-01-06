# Multi-Tenant Food Ordering SaaS - AI Coding Guidelines

## Architecture Overview

This is a **Next.js 16** application using the **App Router** for a multi-tenant food ordering platform. The system supports restaurants (stores) managing menus and customers placing orders.

### Core Technologies
- **Framework**: Next.js 16 with Turbopack
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Better Auth with organization plugin for multi-tenancy
- **UI**: Shadcn/ui components (New York style) with Tailwind CSS
- **State Management**: Zustand stores
- **Validation**: Zod schemas
- **Email**: Nodemailer with custom templates
- **Linting/Formatting**: Biome

### Multi-Tenant Structure
- **Organizations**: Top-level tenants for grouping stores
- **Stores**: Individual restaurants with unique slugs
- **Users**: Can have roles per store (owner/manager) and organization membership
- **Orders**: Customer orders linked to stores with menu items and add-ons

## Key Patterns & Conventions

### Database Schema (`db/schema.ts`)
- Use `uuid` for primary keys on business entities (stores, menu items, orders)
- Use `text` for auth-related IDs (users, sessions) to match Better Auth
- Foreign key references with `onDelete: "cascade"`
- Timestamps with `defaultNow()` and `$onUpdate()` for `updatedAt`
- Enums defined inline: `{ enum: ["value1", "value2"] }`

### Authentication (`lib/auth.ts`, `lib/auth-client.ts`)
- Better Auth with organization plugin enabled
- Email verification required for sign-up
- OTP available as secondary verification
- Client uses `organizationClient()` plugin
- API route: `app/api/auth/[...all]/route.ts`

### Component Structure
- **UI Components**: `components/ui/` - shadcn/ui primitives
- **Common Components**: `components/common/` - shared across app (header, theme provider)
- **Dashboard Components**: `components/dashboard/` - sidebar, charts, navigation
- **Home/Auth Components**: `components/home/auth/` - landing page auth flow

### State Management (`stores/`)
- Zustand stores for UI state (auth modal, active tabs)
- Client-side only with `'use client'` directive
- Type-safe with TypeScript interfaces

### Validation (`schemas/`)
- Zod schemas in `schemas/auth.ts` and `schemas/validators.ts`
- Reusable validators: `emailSchema`, `passwordSchema`
- Form data types inferred with `z.infer<>`

### Email System (`lib/email/`)
- Templates in `lib/email/email-template.ts`
- Transporter config in `lib/email/transporter.ts`
- Send function handles verification, reset, OTP, welcome emails

## Development Workflows

### Package Management
```bash
pnpm dev     # Development with Turbopack
pnpm build   # Production build with Turbopack
pnpm start   # Start production server
pnpm lint    # Biome check
pnpm format  # Biome format
```

### Database Operations
- Schema changes in `db/schema.ts`
- Generate migrations: `drizzle-kit generate`
- Apply migrations: `drizzle-kit migrate`
- Push schema: `drizzle-kit push` (for development)

### Environment Variables (`lib/env.ts`)
Required variables:
- `DATABASE_URL` - PostgreSQL connection
- `SITE_NAME`, `SUPPORT_EMAIL` - Site branding
- Email config: `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASSWORD`
- `NEXT_PUBLIC_APP_URL` - Public app URL
- Optional: `VERIFICATION_EXPIRES_MINUTES`, `RESET_PASSWORD_EXPIRES_MINUTES`, `OTP_EXPIRES_MINUTES`

## File Organization Examples

### Adding a New Dashboard Page
Create in `app/dashboard/[feature]/page.tsx`:
```tsx
export default function FeaturePage() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          {/* Content */}
        </div>
      </div>
    </div>
  )
}
```

### Database Query Pattern
```typescript
import { db } from "@/db"
import { stores } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function getStoreBySlug(slug: string) {
  return await db.select().from(stores).where(eq(stores.slug, slug))
}
```

### Form with Validation
```tsx
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signInSchema, type SignInFormData } from "@/schemas/auth"

const form = useForm<SignInFormData>({
  resolver: zodResolver(signInSchema),
  // ...
})
```

## Common Integration Points

- **Auth Context**: Use `authClient` for sign-in/out, session management
- **Theme**: `next-themes` with `ThemeProvider` in root layout
- **Charts**: Recharts components in dashboard
- **Drag & Drop**: `@dnd-kit` for sortable interfaces
- **Tables**: `@tanstack/react-table` for data tables

## Performance Considerations

- Turbopack enabled for faster dev builds
- Server components by default, mark client components with `'use client'`
- Absolute imports with `@/` aliases configured in `tsconfig.json`
- CSS variables for theming in `app/globals.css`</content>
<parameter name="filePath">/Users/mac/Code/multi-tenant-food-ordering-saas/.github/copilot-instructions.md