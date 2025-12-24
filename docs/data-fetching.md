# Data Fetching

## Critical Rules

**THESE RULES MUST BE FOLLOWED WITHOUT EXCEPTION:**

1. ✅ **ALL data fetching MUST be done via Server Components**
2. ❌ **NEVER fetch data via route handlers (API routes)**
3. ❌ **NEVER fetch data via client components**
4. ❌ **NEVER use raw SQL queries**
5. ✅ **ALL database queries MUST use Drizzle ORM**
6. ✅ **ALL database queries MUST go through helper functions in `/data` directory**
7. 🔒 **Users MUST ONLY access their own data** (enforce authorization in ALL queries)

## Architecture

### Data Flow Pattern

```
Server Component → /data helper function → Drizzle ORM → Database
```

**This is the ONLY allowed data fetching pattern in this application.**

## Server Components for Data Fetching

All data fetching must happen in Server Components. This provides:
- Server-side rendering with no client-side data fetching waterfalls
- Direct database access without exposing queries to the client
- Automatic request deduplication via React Server Components
- Better performance and security

### Example: Correct Pattern ✅

```tsx
// app/workouts/page.tsx (Server Component)
import { getUserWorkouts } from '@/data/workouts';
import { auth } from '@/lib/auth'; // or your auth solution

export default async function WorkoutsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }

  // Data fetched in Server Component via helper function
  const workouts = await getUserWorkouts(session.user.id);

  return (
    <div>
      {workouts.map(workout => (
        <WorkoutCard key={workout.id} workout={workout} />
      ))}
    </div>
  );
}
```

### Example: INCORRECT Patterns ❌

```tsx
// ❌ WRONG: Fetching via route handler
// app/api/workouts/route.ts
export async function GET() {
  const workouts = await db.select().from(workouts);
  return Response.json(workouts);
}

// ❌ WRONG: Fetching in client component
'use client';
export default function WorkoutsPage() {
  const [workouts, setWorkouts] = useState([]);

  useEffect(() => {
    fetch('/api/workouts')
      .then(res => res.json())
      .then(setWorkouts);
  }, []);

  // ...
}

// ❌ WRONG: Using raw SQL
export async function getUserWorkouts(userId: string) {
  return await db.execute(
    `SELECT * FROM workouts WHERE user_id = ${userId}`
  );
}
```

## Data Directory Structure

All database queries must be organized in the `/data` directory:

```
data/
├── workouts.ts        # Workout-related queries
├── exercises.ts       # Exercise-related queries
├── users.ts          # User-related queries
└── training-logs.ts  # Training log queries
```

### Helper Function Pattern

Every data helper function MUST:
1. Accept the user ID as the first parameter (for authorization)
2. Use Drizzle ORM (never raw SQL)
3. Filter by user ID to ensure data isolation
4. Handle errors appropriately
5. Return properly typed data

### Example: Data Helper Function ✅

```typescript
// data/workouts.ts
import { db } from '@/lib/db';
import { workouts } from '@/lib/db/schema';
import { eq, and, desc } from 'drizzle-orm';

/**
 * Get all workouts for a specific user
 * @param userId - The authenticated user's ID
 * @returns Array of workouts belonging to the user
 */
export async function getUserWorkouts(userId: string) {
  return await db
    .select()
    .from(workouts)
    .where(eq(workouts.userId, userId))
    .orderBy(desc(workouts.createdAt));
}

/**
 * Get a specific workout for a user
 * @param userId - The authenticated user's ID
 * @param workoutId - The workout ID to fetch
 * @returns The workout or null if not found/unauthorized
 */
export async function getUserWorkout(userId: string, workoutId: string) {
  const result = await db
    .select()
    .from(workouts)
    .where(
      and(
        eq(workouts.id, workoutId),
        eq(workouts.userId, userId) // CRITICAL: Always filter by userId
      )
    )
    .limit(1);

  return result[0] ?? null;
}

/**
 * Create a new workout for a user
 * @param userId - The authenticated user's ID
 * @param data - Workout data to insert
 */
export async function createWorkout(
  userId: string,
  data: { name: string; description?: string }
) {
  const [workout] = await db
    .insert(workouts)
    .values({
      ...data,
      userId, // CRITICAL: Always set userId from authenticated user
    })
    .returning();

  return workout;
}
```

## Authorization & Data Isolation

### Critical Security Requirements

🔒 **EVERY database query MUST enforce that users can only access their own data.**

This is enforced by:
1. Always requiring `userId` as a parameter to data helper functions
2. Always including `userId` in WHERE clauses
3. Getting `userId` from authenticated session (never from request params/body)

### Example: Enforcing Data Isolation ✅

```typescript
// Server Component
export default async function WorkoutDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }

  // getUserWorkout will ONLY return the workout if it belongs to this user
  const workout = await getUserWorkout(session.user.id, params.id);

  if (!workout) {
    notFound(); // Either doesn't exist or user doesn't have access
  }

  return <WorkoutDetail workout={workout} />;
}
```

### Example: Security Violation ❌

```typescript
// ❌ WRONG: Taking userId from URL params (can be manipulated!)
export async function getWorkout(workoutId: string, userId: string) {
  return await db.query.workouts.findFirst({
    where: (workouts, { eq, and }) =>
      and(eq(workouts.id, workoutId), eq(workouts.userId, userId)),
  });
}

// ❌ WRONG: Not filtering by userId at all
export async function getWorkout(workoutId: string) {
  return await db.query.workouts.findFirst({
    where: (workouts, { eq }) => eq(workouts.id, workoutId),
  });
}
```

## Using Drizzle ORM

### Why Drizzle Only?

- Type safety: Queries are fully typed based on your schema
- Security: Parameterized queries prevent SQL injection
- Maintainability: Easier to refactor and update
- Consistency: Uniform query patterns across the codebase

### Common Drizzle Patterns

```typescript
import { db } from '@/lib/db';
import { workouts, exercises } from '@/lib/db/schema';
import { eq, and, desc, gte, like } from 'drizzle-orm';

// SELECT with WHERE
const userWorkouts = await db
  .select()
  .from(workouts)
  .where(eq(workouts.userId, userId));

// SELECT with multiple conditions
const recentWorkouts = await db
  .select()
  .from(workouts)
  .where(
    and(
      eq(workouts.userId, userId),
      gte(workouts.createdAt, startDate)
    )
  )
  .orderBy(desc(workouts.createdAt));

// JOIN
const workoutsWithExercises = await db
  .select()
  .from(workouts)
  .leftJoin(exercises, eq(exercises.workoutId, workouts.id))
  .where(eq(workouts.userId, userId));

// INSERT
const [newWorkout] = await db
  .insert(workouts)
  .values({ name: 'Leg Day', userId })
  .returning();

// UPDATE
await db
  .update(workouts)
  .set({ name: 'Updated Name' })
  .where(
    and(
      eq(workouts.id, workoutId),
      eq(workouts.userId, userId) // Always check ownership!
    )
  );

// DELETE
await db
  .delete(workouts)
  .where(
    and(
      eq(workouts.id, workoutId),
      eq(workouts.userId, userId) // Always check ownership!
    )
  );
```

## When to Use Route Handlers

Route handlers (API routes) should ONLY be used for:
- Webhooks from external services
- Server actions that don't return data (mutations can also use Server Actions)
- Non-database operations (e.g., sending emails, processing payments)

**Route handlers should NEVER be used for fetching data to display in the UI.**

## Checklist for Data Fetching

Before implementing any data fetching feature, verify:

- [ ] Data is being fetched in a Server Component (not client component or route handler)
- [ ] A helper function exists in `/data` directory
- [ ] Helper function uses Drizzle ORM (no raw SQL)
- [ ] Helper function accepts `userId` as first parameter
- [ ] All queries filter by `userId` to enforce data isolation
- [ ] `userId` comes from authenticated session (not request params)
- [ ] Error handling is implemented
- [ ] Types are properly defined

## Summary

**Remember: Server Components → `/data` helpers → Drizzle ORM → Database**

This pattern ensures:
- ✅ Better performance (no client-side fetching)
- ✅ Better security (queries never exposed to client)
- ✅ Better type safety (Drizzle ORM + TypeScript)
- ✅ Data isolation (users only see their data)
- ✅ Maintainability (consistent patterns)

**NEVER deviate from this pattern unless explicitly documented otherwise.**
